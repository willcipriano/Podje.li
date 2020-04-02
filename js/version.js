let SOFTWARE_VERSION = false;

class softwareInfo {

    constructor(softwareVersion, buildCodename, debugMode) {
        this.softwareVersion = softwareVersion;
        this.buildCodename = buildCodename;
        this.debugMode = debugMode;
    }

}

function lookupVersionData() {
    $.getJSON("about.json", setVersionData)
        .then(reportSoftwareVersion);
}

function setVersionData(data) {
    SOFTWARE_VERSION = new softwareInfo(data["software-version"],
        data["build-codename"], data["debug-mode"]);
}

function getVersionData() {

    if (SOFTWARE_VERSION === false) {
        lookupVersionData();
    }

    return SOFTWARE_VERSION;
}

function reportSoftwareVersion() {

    if (SOFTWARE_VERSION.debugMode) {
        console.log("Podje.li");
        console.log("Version: " + SOFTWARE_VERSION.softwareVersion);
        console.log("Codename: " + SOFTWARE_VERSION.buildCodename);
        console.log("Debug Mode: " + SOFTWARE_VERSION.debugMode);
    }
}

$(document).ready(function() {
    lookupVersionData();
});