// Per npm init: Use npm install <pkg> --save afterwards to install a package and save it as a dependency in the package.json file. – Brad Koch May 25 '13 at 23:40 

var express = require('express');
var nconf = require('nconf');
var http = require('http');
var https = require('https');
var fs = require('fs');

var doorOperationExecuter = require("./doorHandling/doorOperationExecuter");
var doorOperations = require("./doorHandling/doorOperationsTest"); //use for test on non raspberry
//var doorOperations = require("./doorHandling/doorOperations");

//load config file 
var config = require('./config.json');

//Setup Doors:
var doors = config.doors;

//Setup pseudo secure path
var secureUrl = config.secureUrl;

//Load ssl cert from file
var sslOptions = {
  key: fs.readFileSync('./certificate/key.pem'),
  cert: fs.readFileSync('./certificate/cert.pem'),
  passphrase: config.sslPassword
};

//Setup server
var PORT = 3000;
var app = express();

//Disable x-powered-by header to make i a bit harder to identify what server software we're running
app.disable('x-powered-by'); 

//Set static routes to html-pages 
app.use('/' + secureUrl, express.static( __dirname + "/public"));
app.use(express.static( __dirname + "/public/404.html"));

//http.createServer(app).listen(PORT);
https.createServer(sslOptions, app).listen(PORT)

//Set routers to door opener
app.get('/api/:command/:doorNumber', function (req, res, next) {

  var action = req.params.command;
  var doorNumber =  req.params.doorNumber

  doorOperationExecuter.execute(doorOperations, doors, doorNumber, action, function(err, data) {
      if (err) {
        next(err);
        return;
      }
      var message = 'Command ' + action + ' sent to door: '  + doorNumber ; 
      res.send({
        message : message
      });
    })
});

//handle errors 
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
   res.send({
        message: err.message,
        error: err
    });
   return;
});

//catch-all route that will send an 404 
app.get('*', function(req, res, next) {
  err = new Error();
  err.status = 404;
  next(err);
});

