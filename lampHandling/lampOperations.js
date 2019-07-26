var rpio = require('rpio');
function on(lamp, callback)
{
    console.log("Switch on lamp " + lamp.lampNumber + " gpio " + lamp.gpio);
    rpio.open(lamp.gpio, rpio.OUTPUT, rpio.LOW);
    rpio.write(lamp.gpio, rpio.LOW);
}

function off(lamp, callback)
{
    console.log("Switch off lamp " + lamp.lampNumber + " gpio " + lamp.gpio);
    rpio.open(lamp.gpio, rpio.OUTPUT, rpio.HIGH);
    rpio.write(lamp.gpio, rpio.HIGH);
}

function onTimer(lamp, onTime, callback)
{
    on(lamp, callback);
    var myInt = setInterval(function () {
       off(lamp,callback);
    }, onTime * 1000);
}



exports.on = on;
exports.off = off;
exports.onTimer = onTimer;
