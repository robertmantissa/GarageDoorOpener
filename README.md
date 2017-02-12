# garagedoor
Yet another raspberry pi garagedoor opener

**Configuration**
Needs a file called config.json in the root that looks like this
>  {"doors": [
>      { "doorNumber": 1, "openGpio": 3, "closeGpio": 5, "stopGpio": 7},
>      { "doorNumber": 2, "openGpio": 11, "closeGpio": 13, "stopGpio": 15}
>      ],
>  "secureUrl": "SomeRanddomstring", // basically a trick not to serve the page at the root url
>  "sslPassword" : "SEKKRITPASSWORD" // The ssl certificate password 
>  }

**SSL Certificate**
To create the ssl certificate run the following command: 
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 1000

Copy key.pem and cert.pem to the root folder
