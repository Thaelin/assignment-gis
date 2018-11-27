const config = require('./config.json');
const { Pool } = require('pg');
const DbMaker = require('./components/db_maker/db_maker.js');

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

console.log('Application is starting...');

// initialize database pool
console.log('Establishing connection with PostgreSQL database');
const pool = new Pool(config.db);
console.log('Successfully connected to database');

pool.query('SELECT version()', function(err, res) {
    if (!err) {
        console.log('PostgreSQL version: ' + res.rows[0].version);
    }
    else {
        throw err;
    }
});

function selectTracks() {
    pool.query(' SELECT ogc_fid, ST_AsGeoJSON(ST_GeomFromWKB(wkb_geometry)), name FROM tracks', (err, res) => {
        if (!err) {
            console.log('Received tracks data:');
            console.log(res);
        }
        else {
            throw err;
        }
    });
}

selectTracks();

if (dbMake || dbPopulate) {
    console.log('Initializing DB maker...');
    const dbMaker = new DbMaker(pool);

    if (dbMake) {
        // there will be execution of DDL commands
    }
    
    if (dbPopulate) {
        console.log('Populating city table');
        dbMaker.pupulateCityTable();
    }
}

