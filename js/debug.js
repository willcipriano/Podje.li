let DEBUG_STATUS;
let DEBUG_MESSAGE;
let VERSION_CHECKS = 0;
let DEBUG_INIT = false;
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

function getDebugInit() {
    return DEBUG_INIT;
}

function debugSetup() {
    if (getVersionData().debugMode) {
        DEBUG_STATUS = "nominal";
        DEBUG_MESSAGE = "online";
        DEBUG_MESSAGES.push("online");
        $("#debugButton").show();
        DEBUG_INIT = true;
    }
    else {
        DEBUG_STATUS = "disabled";
        DEBUG_MESSAGE = "disabled";
        DEBUG_MESSAGES.push("disabled");
        $("#debugButton").hide();
        DEBUG_INIT = true;
    }
}

async function debugCheckVersion() {
    if (VERSION_CHECKS > 3) {
        return false;
    }

    if (getVersionData() === false) {
        VERSION_CHECKS += 1;
        setTimeout(debugCheckVersion, 100);
    }
    else {
        debugSetup();
    }

}

$(document).ready(function () {
    debugCheckVersion()
});