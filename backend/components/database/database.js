const { Pool } = require('pg');
const config = require('../../config.json');

class Database {
    constructor(logger) {
        this.logger = logger;

        try {
            this.pool = new Pool(config.db);
            this.version();
        }
        catch (error) {
            this.logger.error('Database pool could not be initialized: ' + error);
        }
    }

    version() {
        if (this.pool) {
            this.pool.query('SELECT version()', (err, res) => {
                if (!err) {
                    this.logger.info('PostgreSQL version is: ' + res.rows[0].version);
                }
                else {
                    this.logger.error(err);
                    throw err;
                }
            });
        }
        else {
            this.logger.error('Database pool is not initialized');
        }
    }

    allCyclingRoutes(callback) {
        this.pool.query('SELECT fid, name, ST_AsGeoJSON(route) AS route, ST_Length(route::geography)/1000 as length FROM cycling_routes', callback);
    }

    getRouteMilestones(routeId, callback) {
        let queryCond = routeId !== undefined ? 'WHERE fid = $1' : '';

        this.pool.query(
            `
            SELECT 
                fid,
                ST_Length(route::geography)/1000 as length,
                ST_AsGeoJSON(ST_StartPoint(ST_LineMerge(route))) AS route_start,
                ST_AsGeoJSON(ST_Line_Interpolate_Point(ST_LineMerge(route), 0.25)) AS route_first_quarter,
                ST_AsGeoJSON(ST_Line_Interpolate_Point(ST_LineMerge(route), 0.5)) AS route_middle,
                ST_AsGeoJSON(ST_Line_Interpolate_Point(ST_LineMerge(route), 0.75)) AS route_third_quarter,
                ST_AsGeoJSON(ST_EndPoint(ST_LineMerge(route))) AS route_finish
            FROM cycling_routes
            ${queryCond}
            `,
            routeId !== undefined ? [ routeId ] : [],
            callback
        );
    }

    saveWeatherData(routeId, pointType, sensors, weather, callback) {
        this.pool.query(
            `
            INSERT INTO cycling_routes_weather (cycling_route_id, point_type, weather, measure_date)
            VALUES($1, $2, ($3, $4, $5, $6, $7, $8), $9)
            `,
            [ routeId, pointType, sensors.temperature, sensors.humidity, sensors.pressure, weather.icon, weather.description, weather.index, new Date() ],
            callback
        );
    }

    getRouteWeather(routeId, callback) {
        this.pool.query(
            `
            SELECT point_type, weather, measure_date FROM (
                SELECT id, point_type, weather, measure_date, 
                rank() OVER (
                    PARTITION BY point_type ORDER BY measure_date DESC
                ) 
                FROM cycling_routes_weather
                WHERE cycling_route_id = $1
            ) actual_weather
            WHERE rank = 1
            `,
            [ routeId ],
            callback
        );
    }
}

module.exports = Database;