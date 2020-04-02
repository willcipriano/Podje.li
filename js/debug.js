let DEBUG_STATUS;
let DEBUG_MESSAGE;
const DEBUG_MESSAGES = [];

async function setDebugStatus(newStatus) {
        if (getVersionData().debugMode) {
            msgString = "Debug status changed from " + DEBUG_STATUS + " to " + newStatus;
            setDebugMessage(msgString);
        }

    DEBUG_STATUS = newStatus;
}

async function setDebugMessage(newMessage) {
    if (getVersionData().debugMode) {
        DEBUG_MESSAGES.push(newMessage);
        console.log("Debug Message: '" + newMessage + "'");
    }

    DEBUG_MESSAGE = newMessage;

}

function getDebugStatus() {
    return DEBUG_STATUS;
}

function getDebugMessage() {
    return DEBUG_MESSAGE;
}

function getDebugMessages() {
    return DEBUG_MESSAGES;
}

$(document).ready(function () {

if (getVersionData().debugMode) {
    DEBUG_STATUS = "nominal";
    DEBUG_MESSAGE = "online";
    DEBUG_MESSAGES.push("online");
    $("#debugButton").show();
}
else {
    DEBUG_STATUS = "disabled";
    DEBUG_MESSAGE = "disabled";
    DEBUG_MESSAGES.push("disabled");
    $("#debugButton").hide();
} });