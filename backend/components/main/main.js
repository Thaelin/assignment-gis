const express = require('express');
const https = require('https');
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
                this.db.allCyclingRoutes((error, data) => {
                    if (error) {
                        this.logger.erorr(error);
                        throw new Error;
                    }
                    else {
                        let parsedData = [];

                        // parse data to JSON
                        data.rows.forEach((route) => {
                            parsedData.push({
                                name: route.name,
                                route: JSON.parse(route.route)
                            });
                        });

                        res.json(parsedData);
                    }
                });
            });

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
                setInterval(this.actualizeWeather, config.weather.actualizationTimerMs | 60000);
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
        var requestUrl = undefined;

        this.db.allCyclingRoutes((err, res) => {
            if (err) {
                this.logger.error('Error while selecting all cycling routes');
                throw 'Error while selecting all cycling routes';
            }
            else {
                if (res) {
                    res.rows.forEach((item) => {
                        https.get(requestUrl + config.weather.apiToken, response => {
                            let data = 'https://api.darksky.net/forecast/'+config.weather.apiToken+'/'+req.params.latitude+','+req.params.longitude+'?units=si'
                    
                            // a chunk of data has been received
                            response.on('data', (chunk) => {
                                data += chunk;
                            });
                
                            // the whole response has been received
                            response.on('end', () => {
                                let apiResponse = JSON.parse(data);
                                this.logger.info('Received weather data from Dark Sky API: ' + apiResponse);
                                let weather = {
                                    latitude: apiResponse.latitude,
                                    longitude: apiResponse.longitude,
                                    timezone: apiResponse.timezone,
                                    time: apiResponse.currently.time,
                                    icon: apiResponse.currently.icon,
                                    temperature: apiResponse.currently.temperature,
                                    humidity: apiResponse.currently.humidity,
                                    pressure: apiResponse.currently.pressure,
                                    windSpeed: apiResponse.currently.windSpeed,
                                    visibility: apiResponse.currently.visibility
                                };
                                this.logger.info('Sending weather data object to client: ' + weather);
                                
                                // here will be DB insert
                
                            });
                        }).on('error', error => {
                            this.logger.error('Error occured while getting actual weather data: ' + error);
                        });
                    });
                }
            }
        });

        
    }
}

module.exports = Main;