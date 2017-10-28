function open(door, callback)
{
    console.log("Open door " + door.doorNumber + " gpio " + door.openGpio);
    callback(null, null)
}

function close(door, callback)
{
    console.log("Close door " + door.doorNumber + " gpio " + door.closeGpio);
    callback(null, null)
}

function stop(door, callback)
{
    console.log("Stop door " + door.doorNumber + " gpio " + door.stopGpio);
    callback(null, null)
}


function isOpen(door, callback)
{
      console.log("Read door " + door.doorNumber + " gpio " + door.switchGpio);
      callback(null, true)
}

exports.open = open;
exports.close = close;
exports.stop = stop;
exports.isOpen = isOpen;