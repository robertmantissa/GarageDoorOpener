function execute(lampOperation, lamps, lampNumber, action, callback)
{
    if(typeof lampOperation[action] === 'function')
    {
        var lamp = lamps[lampNumber-1];
        lampOperation[action](lamp, callback);
    }
    else
    {
        var errorMessage = "Lamp operation not found: '" + action + "'";
        callback(new Error(errorMessage), null);
        return;
    }
}

exports.execute = execute;
