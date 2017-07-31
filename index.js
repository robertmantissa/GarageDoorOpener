// Per npm init: Use npm install <pkg> --save afterwards to install a package and save it as a dependency in the package.json file. – Brad Koch May 25 '13 at 23:40 

var express = require('express'),
    expressLogging = require('express-logging'),
    logger = require('logops');

var cookieParser = require('cookie-parser')
var session = require('express-session')
var bodyParser = require('body-parser');

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
var blacklist = ['/script', '/css'];
app.use(expressLogging(logger, {blacklist: blacklist, policy: 'params'}));

//Disable x-powered-by header to make i a bit harder to identify what server software we're running
app.disable('x-powered-by');

//http.createServer(app).listen(PORT);
https.createServer(sslOptions, app).listen(PORT) 

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(session({
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true
}) );

//Set static routes to html-pages 
app.use('/', express.static( __dirname + "/public"));

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (!(req.session && req.session.user === "DoorUser" && req.session.admin))
    res.redirect('/login');
  else   
   next();
};

app.post('/login', function (req, res) {
 if(req.body.password === config.password) {
    req.session.user = "DoorUser";
    req.session.admin = true;   
    var hour = 3600000;
    req.session.cookie.maxAge = 5 * 365 * 24 * hour; //5 years
    res.redirect('/door');
  }
  else
  {
     res.redirect('/login?WrongPassword=1');
  }
});

// Login endpoint
app.get('/login', function (req, res) {
     res.sendFile(__dirname + '/public/index.html'); 
     return;  
});

// Logout endpoint
app.get('/logout', auth, function (req, res) {
  req.session.destroy();
  res.sendFile(__dirname + '/public/logout.html'); 
});

// Get content endpoint
app.get('/door', auth, function (req, res) {
    res.sendFile(__dirname + '/loggedin/index.html'); 
});

app.use(function(req, res, next){
  res.status(404);
   res.sendFile(__dirname + '/public/404.html'); 
});


//Set routers to door opener
app.get('/api/:command/:doorNumber', auth, function (req, res, next) {

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



// //catch-all route that will send an 404 
// app.get('*', function(req, res, next) {
//   err = new Error();
//   err.status = 404;
//   next(err);
// });


//handle errors 
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
   res.send({
        message: err.message,
        error: err
    });
   return;
});

