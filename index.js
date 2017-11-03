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
var hasha = require('hasha');

var doorOperationExecuter = require("./doorHandling/doorOperationExecuter");

//load config file 
var config = require('./config.json');

//mock gpio in test mode:
var doorOperations; 
if (config.testMode){
  doorOperations = require("./doorHandling/doorOperationsTest"); //use for test on non raspberry
}
else{
  doorOperations = require("./doorHandling/doorOperations");
}

//Setup Doors:
var doors = config.doors;

//Setup pseudo secure path
var secureUrl = config.secureUrl;

//Load ssl cert from file
var sslOptions = {
  key: fs.readFileSync(process.cwd() + '/certificate/key.pem'),
  cert: fs.readFileSync(process.cwd() + '/certificate/cert.pem'),
  passphrase: config.sslPassword
};

//Setup server
var PORT = config.httpPort;
var app = express();
var blacklist = ['/script', '/css'];
app.use(expressLogging(logger, { blacklist: blacklist, policy: 'message' }));

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
}));

//Set static routes to html-pages 
app.use('/', express.static(__dirname + "/public"));

// Authentication and Authorization Middleware
var auth = function (req, res, next) {
  if (!(req.session && req.session.user === "DoorUser" && req.session.admin)) {
    res.status(401);
    if (req.url.substr(0, 4) == "/api") {
      res.send({
        message: "Not authenticated",
        error: "Error!"
      });
    }
    else {
      res.redirect('/login');
    }
  }
  else
    next();
};

app.post('/login', function (req, res) {
  var incomingPassword = hasha(req.body.password + config.salt);
  var storedPassword = config.password;
  if (incomingPassword === storedPassword) {
    req.session.user = "DoorUser";
    req.session.admin = true;
    var hour = 3600000;
    req.session.cookie.maxAge = 5 * 365 * 24 * hour; //5 years
    res.redirect('/door');
  }
  else {
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
  res.sendFile(__dirname + '/loggedIn/index.html');
});



//Set routers to door opener
app.get('/api/:command/:doorNumber', auth, function (req, res, next) {

  var action = req.params.command;
  var doorNumber = req.params.doorNumber
  var result;
  doorOperationExecuter.execute(doorOperations, doors, doorNumber, action, function (err, data) {
    if (err) {
      next(err);
      return;
    }
    result = data;
  })

  var message = 'Command ' + action + ' sent to door: ' + doorNumber + ' with result ' + result;
  res.status(200);
  res.send({
    message: message
  });
});

app.use(function (req, res, next) {

  res.sendFile(__dirname + '/public/404.html');
});

//handle errors 
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: err
  });
  return;
});

