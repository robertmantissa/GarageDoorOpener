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

exports.on = on;
exports.off = off;