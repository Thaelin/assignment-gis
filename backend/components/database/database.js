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

    allCyclingRoutes() {
        this.pool.query('SELECT name, ST_AsGeoJSON(route) FROM cycling_routes', (err, res) => {
            if (!err) {
                this.logger.info('Received tracks data:');
                this.logger.info(res);
                return res;
            }
            else {
                this.logger.error(err);
                return false;
            }
        });
    }
}

module.exports = Database;