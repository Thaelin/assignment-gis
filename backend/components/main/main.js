const express = require('express');
const Logger = require('../../components/logger/logger.js');
const Database = require('../../components/database/database.js');
const path = require('path');
const config = require('../../config.json');

class Main {
    constructor() {
        console.log('Smart cycling application is starting');
        this.app = express();
        this.initLoggerComponent();
        this.initDatabaseComponent();
        this.initApi();
    }

    initLoggerComponent() {
        this.logger = new Logger();
        this.logger.info('Logger component has been initialized');
    }

    initDatabaseComponent() {
        if (this.logger) {
            this.db = new Database(this.logger);
        }
        else {
            throw 'Database component can not be initialised without initialising Logger component first';
        }
    }

    initApi() {
        if (this.logger && this.db) {
            this.app.get('/', (req, res) => {
                res.sendFile(path.join(__dirname, '../../../frontend/index.html'));
            });
            
            this.app.get('/cyclingRoutes', (req, res) => {
                console.log(this);
                let data = this.db.allCyclingRoutes();
                let parsedData = [];

                // parse data to JSON
                data.forEach((route) => {
                    route.route = JSON.parse(route.route);
                    parsedData.push(route);
                });

                res.json(parsedData);
            });

            this.app.use(express.static(path.join(__dirname, '../../../frontend')));

            this.app.listen(config.webserver.port);
        }
        else {
            throw 'Api can not be initialised without initialising Logger and Database component first';
        }
    }
}

module.exports = Main;