function on(lamp, callback)
{
    console.log("Switch on lamp " + lamp.lampNumber + " gpio " + lamp.gpio);
    callback(null, null)
}

function off(lamp, callback)
{
    console.log("Switch off lamp " + lamp.lampNumber + " gpio " + lamp.gpio);
    callback(null, null)
}

exports.on = on;
exports.off = off;