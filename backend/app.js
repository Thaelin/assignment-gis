const config = require('./config.json');
const { Pool } = require('pg');
const DbMaker = require('./components/db_maker/db_maker.js');
const { DataCollector, WeatherDataCollector } = require('./components/data_collector/data_collector.js');

/* check process arguments */

const dbMake = process.argv.find(function(arg) {
    console.log(arg);
    return arg == 'db-make';
});

const dbPopulate = process.argv.find(function(arg) {
    return arg == 'db-populate';
});

const dataCollect = process.argv.find(function(arg) {
    return arg == 'collect-data';
});

/* start application */
init();

function init() {
    console.log('Application is starting...');

    // initialize database pool
    console.log('Establishing connection with PostgreSQL database');
    const pool = new Pool(config.db);
    console.log('Successfully connected to database');

    pool.query('SELECT version()', function(err, res) {
        if (!err) {
            console.log('PostgreSQL version: ' + res.rows[0].version);
            initComponents(pool);
        }
        else {
            throw err;
        }
    });
}

function initComponents(pool) {
    if (dbMake || dbPopulate) {
        console.log('Initializing DB maker...');
        const dbMaker = new DbMaker(pool);

        if (dbMake) {
            // there will be execution of DDL commands
        }
        
        if (dbPopulate) {
            console.log('Populating city table');
            dbMaker.populateCityTable();
        }
    }

    if (dataCollect) {
        console.log('Initializing data collector...');
        const wdCollector = new WeatherDataCollector(pool, config.weatherApi.apiKey);
        wdCollector.start();
    }
}
