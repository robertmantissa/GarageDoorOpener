

var hasha = require('hasha');
//load config file 
var config = require('./config.json');

console.log('Your hashed password for password ' + process.argv[2]);
console.log(hasha(process.argv[2] + config.salt));