const Main = require('./components/main/main.js');

/* check process arguments */

/*
const dbMake = process.argv.find(function(arg) {
    console.log(arg);
    return arg == 'db-make';
});
*/

/* start application */

var app = new Main();
