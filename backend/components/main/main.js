const express = require('express');
const http = require('http');
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
        this.initWeatherActualize();
        require('../swagger/swagger')(this.app, this.logger);
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
            
            this.app.get('/api/cyclingRoutes', (req, res) => {
                this.db.allCyclingRoutes((error, data) => {
                    if (error) {
                        this.logger.error(error);
                        throw new Error;
                    }
                    else {
                        let parsedData = [];

                        // parse data to JSON
                        data.rows.forEach((route) => {
                            parsedData.push({
                                name: route.name,
                                route: JSON.parse(route.route),
                                length: route.length
                            });
                        });

                        res.json(parsedData);
                    }
                });
            });

            console.log(path.join(__dirname, '../../../frontend'))
            this.app.use(express.static(path.join(__dirname, '../../../frontend')));

            this.app.listen(config.webserver.port);
        }
        else {
            throw 'Api can not be initialised without initialising Logger and Database component first';
        }
    }

    initWeatherActualize() {
        if (this.logger && this.db) {
            if (config.weather.apiToken != "undefined") {
                setInterval(this.actualizeWeather.bind(this), 1000);
            }
            else {
                throw 'Weather actualizer can not start because Dark Sky API token was not provided in config.json';
            }
        }
        else {
            throw 'Weather actualize can not be initialised without initialising Logger and Database component first';
        }
    }

    actualizeWeather() {
        var requestUrl = 'http://api.openweathermap.org/data/2.5/weather?';

        this.db.getRouteBoundaries((err, res) => {
            if (err) {
                this.logger.error('Error while selecting cycling route boundaries');
                throw 'Error while selecting cycling route boundaries';
            }
            else {
                if (res) {
                    res.rows.forEach((item) => {
                        console.log(item);
                        let startPoint = JSON.parse(item.route_start);
                        let endPoint = JSON.parse(item.route_finish);

                        http.get(
                            `${requestUrl}lat=${startPoint.coordinates[1]}&lon=${startPoint.coordinates[0]}&APPID=${config.weather.apiToken}&units=metric`
                            , 
                            response => {
                                let data = '';
                        
                                // a chunk of data has been received
                                response.on('data', (chunk) => {
                                    data += chunk;
                                });
                    
                                // the whole response has been received
                                response.on('end', () => {
                                    let apiResponse = JSON.parse(data);
                                    this.logger.info('Received weather data from OpenWeatherMap API: ' + apiResponse);
                                    console.log(apiResponse);

                                    this.logger.info('Sending weather data object to client: ' + weather);
                                    
                                    // here will be DB insert
                    
                                });
                            }
                        ).on('error', error => {
                            this.logger.error('Error occured while getting actual weather data: ' + error);
                        });
                    });
                }
            }
        });

        
    }
}

module.exports = Main;