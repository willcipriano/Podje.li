"use strict";
const FILESELECTOR = $("#fileSelector");
const FILEREADER = new FileReader();
const MAXCHARS = 2000;
let FILESTRING;
let FILENAME;
let FILEMIME;
let URLS = [];


function getQueryParam(name) {
    const results = new RegExp("[\?&]" + name + "=([^&#]*)")
        .exec(window.location.search);

    return (results !== null) ? results[1] || 0 : false;
}

function loadFile() {
    setDebugStatus("loading file");
    FILEREADER.readAsDataURL(FILESELECTOR[0].files[0]);
    FILEREADER.onloadend = processFileString;
}

function getFileName() {
    return FILENAME;
}

function processFileString() {
    setDebugStatus("Processing file");

    FILEMIME = FILEREADER.result.split(",", 1)[0];

    FILENAME = FILESELECTOR[0].files[0].name;
    FILESTRING = encodeURIComponent(Base64String.compressToUTF16(FILEREADER.result.split(",", 2)[1]));

    let baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    let basicUrl = baseUrl + "?m=" + encodeURIComponent(FILEMIME) + "&n=" + encodeURIComponent(FILENAME) + "&pl=";
    let multiPartStartBaseUrl = baseUrl + "?m=" + encodeURIComponent(FILEMIME) + "&n=" + encodeURIComponent(FILENAME) + "&pt=0000";
    let multiPartUrl = baseUrl + "&p=0000";


    let basicUrlMode = false;

    if (basicUrl.length + FILESTRING.length <= MAXCHARS) {
        basicUrlMode = true;
    }

    if (basicUrlMode) {
        addUrl(basicUrl + FILESTRING);
    } else {

        const multiPartUrlLength = multiPartUrl.length + 4;
        const charsAfterFirstUrl = FILESTRING.length - (MAXCHARS - multiPartStartBaseUrl.length + 4);
        const totalUrlsRequired = Math.ceil(charsAfterFirstUrl / (MAXCHARS - multiPartUrlLength)) + 1;

        let fileStringPos;

        let url = multiPartStartBaseUrl.replace("0000", appendZeros(totalUrlsRequired));
        fileStringPos = MAXCHARS - (url.length + 4);
        url = url + "&mp=" + FILESTRING.substring(0, fileStringPos);


        let urls = new Array(url);
        let part = 2;

        while (fileStringPos < FILESTRING.length) {


            let partNo = appendZeros(part);

            let prevPos = fileStringPos;
            let url = window.location.protocol + "//" + window.location.host + window.location.pathname + "?p=" + partNo + "&mp=";
            fileStringPos = fileStringPos + (MAXCHARS - url.length);

            url = url + FILESTRING.substring(prevPos, fileStringPos);
            urls.push(url);
            part += 1;
        }

        URLS = urls;
        userFileProcessCompleted(URLS);
    }
}


function multipartFileProcessRegister() {
    setDebugStatus("Processing MultiPart File");

    const filename = decodeURIComponent(getQueryParam("n"));
    const mime = decodeURIComponent(getQueryParam("m"));
    const totalParts = parseInt(getQueryParam("pt"));

    localStorage.setItem("filename", filename);
    localStorage.setItem("mime", mime);
    localStorage.setItem("total_parts", totalParts);
    localStorage.setItem("file_part_0001", getQueryParam("mp"));
}

function multipartFileProcessAdd() {
    localStorage.setItem("file_part_" + getQueryParam("p"), getQueryParam("mp"));
}

function detectTotalPartsCompleted() {

    let x = 1;
    let partsFound = [];
    const totalParts = parseInt(localStorage.getItem("total_parts"));

    while (x <= totalParts) {

        if (localStorage.getItem("file_part_" + appendZeros(x))) {
            partsFound.push(x);
        }
        x += 1;
    }

    if (partsFound.length === totalParts) {

        $("#fileCompleteMessage").text("Complete file found!");
        $("#fileFoundModal").modal("show");
        return true;

    } else {

        $("#filePartMessage").text(partsFound.length + " parts found!");
    }


    if (partsFound.length < localStorage.getItem("total_parts")) {
        setTimeout(detectTotalPartsCompleted, 2000);
        return false;
    }


}

function appendZeros(partNo) {
    partNo = partNo.toString();

    while (partNo.length < 4) {
        partNo = "0" + partNo;
    }

    return partNo;
}


function assembleMultiPartFile() {
    setDebugStatus("Starting to assemble multipart file");
    let fileEncoded = "";
    const totalParts = localStorage.getItem("total_parts");

    let i;
    for (i = 1; i <= totalParts; i++) {
        fileEncoded += localStorage.getItem("file_part_" + appendZeros(i));
    }

    let fileBlob = Base64String.decompressFromUTF16(decodeURIComponent(fileEncoded));
    fileBlob = decodeURIComponent(localStorage.getItem("mime")) + "," + fileBlob;

    saveAs(dataUrlToBlob(fileBlob), localStorage.getItem("filename"));
}


function loadSingleFileFromQueryParam() {
    setDebugStatus("loading single file from query param");
    const fileBlob = Base64String.decompressFromUTF16(decodeURIComponent(getQueryParam("pl")));
    const fileBase64 = decodeURIComponent(getQueryParam("m")) + "," + fileBlob;
    saveAs(dataUrlToBlob(fileBase64), getQueryParam("n"));
}


function dataUrlToBlob(dataUrl) {
    setDebugStatus("Converting dataurl to blob");
    let array = dataUrl.split(",");
    let mimeType = array[0].match(/:(.*?);/)[1];
    let base64 = atob(array[1]);
    let x = base64.length;
    let uArray = new Uint8Array(x);

    while (x--) {
        uArray[x] = base64.charCodeAt(x);
    }

    return new Blob([uArray], {type: mimeType});
}

function calculateJSDate(epoch) {
    if (epoch < 9999999999) {
        epoch *= 1000;
    }
    epoch = epoch + (new Date().getTimezoneOffset() * -1);
    return new Date(epoch);
}

function getUrls() {
    return URLS;
}

function getShareUrlsLength() {
    return URLS.length;
}