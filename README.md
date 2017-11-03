# garagedoor
Yet another raspberry pi garagedoor opener

**Configuration**
Needs a file called config.json in the root that looks like this
{"doors": [
    { "doorNumber": 1, "openGpio": 3, "closeGpio": 5, "stopGpio": 7, "switchGpio": 12},
    { "doorNumber": 2, "openGpio": 11, "closeGpio": 13, "stopGpio": 15, "switchGpio": 18}
    ],
"sslPassword" : "hemligt",
"password" : "579d69862347d70ea6cc7c942880cfa7187dc7776f681cad10a54f749a38bfce29ff07ca7fa60b0efa41451b929f6c7327711f249ed18ea6b7d20c90a36b2a51",
"salt" : "saltSalt",
"sessionSecret" : "SomeSecret",
"httpPort" : 3000,
"testMode" : true
}

**Genererate password hash**
After adding the config values, including the salt string (any string is OK, but some preferably 8 characters or more) run
node .\genereatePass.js 'MyLoginPass'  
This will produce the hash to past into password

**SSL Certificate**
To create the ssl certificate run the following command: 
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 1000

Make a folder called /certificate/ and copy key.pem and cert.pem there



