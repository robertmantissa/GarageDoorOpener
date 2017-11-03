# garagedoor
Yet another raspberry pi garagedoor opener

**Configuration**
Needs a file called config.json in the root that looks like this
{"doors": [
    { "doorNumber": 1, "openGpio": 3, "closeGpio": 5, "stopGpio": 7, "switchGpio": 12},
    { "doorNumber": 2, "openGpio": 11, "closeGpio": 13, "stopGpio": 15, "switchGpio": 18}
    ],
"sslPassword" : "SEKRIT",
"password" : "", //Generated with generatePass.js
"salt" : "SomeString",
"sessionSecret" : "YSomeOtherSecertString"
}

**Genererate password hash**
After adding the config values, including the salt string (any string is OK, but some preferably 8 characters or more) run
node .\genereatePass.js 'MyLoginPass'  
This will produce the hash to past into password

**SSL Certificate**
To create the ssl certificate run the following command: 
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 1000

Make a folder called /certificate/ and copy key.pem and cert.pem there



