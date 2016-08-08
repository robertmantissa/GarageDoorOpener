var rpio = require('rpio');
function open(door)
{
    console.log("Open door " + door.doorNumber + " gpio " + door.openGpio);
    toggleGpio(door.openGpio);
}

function close(door)
{
    console.log("Close door " + door.doorNumber + " gpio " + door.closeGpio);
    toggleGpio(door.closeGpio);
}

function stop(door)
{
    console.log("Stop door " + door.doorNumber + " gpio " + door.stopGpio);
    toggleGpio(door.stopGpio);
}


function toggleGpio(gpio)
{
  /*
   * Set the initial state to low.  The state is set prior to the pin becoming
   * active, so is safe for devices which require a stable setup.
   */
    rpio.open(gpio, rpio.OUTPUT, rpio.LOW);
    rpio.write(gpio, rpio.LOW);
    rpio.msleep(500);
    rpio.write(gpio, rpio.HIGH);
}

exports.open = open;
exports.close = close;
exports.stop = stop;