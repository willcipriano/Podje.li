let SOFTWARE_VERSION = false;
let ONLINE = false;

class softwareInfo {
    constructor(softwareVersion, buildCodename, debugMode, aboutSignOff) {
        this.softwareVersion = softwareVersion;
        this.buildCodename = buildCodename;
        this.debugMode = debugMode;
        this.aboutSignOff = aboutSignOff;
    }
}

function lookupVersionData() {
    $.getJSON("about.json", setVersionData)
        .then(reportSoftwareVersion)
        .then(setOnline);
}

function setOnline() {
    ONLINE = true;
}

function setVersionData(data) {
    SOFTWARE_VERSION = new softwareInfo(data["software-version"],
        data["build-codename"], data["debug-mode"], data["about-sign-off"]);
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

lookupVersionData();
