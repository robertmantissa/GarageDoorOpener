function open(door)
{
    console.log("Open door " + door.doorNumber + " gpio " + door.openGpio);
}

function close(door)
{
    console.log("Close door " + door.doorNumber + " gpio " + door.closeGpio);
}

function stop(door)
{
    console.log("Stop door " + door.doorNumber + " gpio " + door.stopGpio);
}

exports.open = open;
exports.close = close;
exports.stop = stop;