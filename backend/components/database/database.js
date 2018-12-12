const { Pool } = require('pg');
const config = require('../../config.json');

class Database {
    constructor(logger) {
        console.log(logger);
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
        this.pool.query('SELECT name, ST_AsGeoJSON(route) AS route, ST_Length(route::geography)/1000 as length FROM cycling_routes', callback);
    }

    getRouteBoundaries(callback) {
        this.pool.query(
            `
            SELECT 
                fid,
                ST_AsGeoJSON(ST_StartPoint(ST_LineMerge(route))) AS route_start, 
                ST_AsGeoJSON(ST_EndPoint(ST_LineMerge(route))) AS route_end
            FROM cycling_routes
            `,
            callback
        );
    }

    saveWeatherData(routeId, temp, press, humidity, icon, type, callback) {
        this.pool.query(
            `
            INSERT INTO cycling_routes_weather
            cycling
            `
        )
    }
}

module.exports = Database;