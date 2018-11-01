const http = require('http');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

class DataCollector {
    constructor(pool, apiKey) {
        this.pool = pool;
        this.isCollecting = false;
        // default collect timer = 5 min
        this.timer = 1000 * 60 * 5;
    }

    // in minutes
    setCollectionTimer(minuteCnt) {
        this.timer = minuteCnt * 60 * 1000;
    }
}

class WeatherDataCollector extends DataCollector {
    constructor(pool, apiKey) {
        super(pool);
        this.apiKey = apiKey;
    }

    collect() {
        console.log('Sending request for weather data for city = Trnava');

        http.get(
            'http://api.openweathermap.org/data/2.5/weather?id=3057124&APPID='+this.apiKey+'&units=metric', 
            function(response) {
                let data = '';

                // a chunk of data has been received
                response.on('data', (chunk) => {
                    data += chunk;
                });

                // the whole response has been received
                response.on('end', () => {
                    console.log('Data received');
                    console.log(JSON.parse(data));
                });
            }
        ).on('error', (error) => {
            console.log('ERROR: ' + error.message);
        });
    }

    start() {
        console.log('Starting weather data collection');
        this.isCollecting = true;

        this.collect();
        setInterval(this.collect.bind(this), this.timer);
    }

    
}

module.exports.DataCollector = DataCollector;
module.exports.WeatherDataCollector = WeatherDataCollector;