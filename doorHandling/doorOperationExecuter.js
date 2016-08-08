function execute(doorOperation, doors, doorNumber, action, callback)
{
    var door = findDoorByDoorNumber(doors, doorNumber);
    if (!door)
    {
        var errorMessage = "Door not found: '" + doorNumber +"'";
        callback(new Error(errorMessage),null);
    }

    if(typeof doorOperation[action] === 'function')
    {
        doorOperation[action](door);
        callback(null, true)
    }
    else
    {
        var errorMessage = "Door operation not found: '" + action + "'";
        err(new Error(errorMessage),null);
        return;
    }
}

function findDoorByDoorNumber(doors, doorNumber)
{
    var door;
    doors.forEach(function(element) {
        if (element.doorNumber == doorNumber)
        {
            door = element;
        }
    }, this);
    
    return door;
}

exports.execute = execute;