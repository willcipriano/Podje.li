class encodeRequest {

    constructor(filename, fileExtension, urls, options, outputType) {
        this.fileName = filename;
        this.fileExtension = fileExtension;
        this.urls = urls;
        this.options = options;
        this.outputType = outputType;
    }

}


function basicHTMLEncoder(encodeReq) {
    setDebugStatus('basicHtmlEncoder start');
    let html = '<p>' + encodeReq.fileName + '</p>';
    let x;

    for (x = 0; x < encodeReq.urls.length; x++) {
        html += "<p><a href='" + encodeReq.urls[x] + "'>Part " + x + "</a></p>\n";
    }
    return html;
}

function basicCSVEncoder(encodeReq) {
    setDebugStatus('basicCSVEncoder start');
    let csv = "";
    let x;
    const quoteUrl = encodeReq.options.includes('csvQuoteURL');
    const excelStyleUrl = encodeReq.options.includes('csvExcelURL');

    console.log(excelStyleUrl)

    if (encodeReq.options.includes('csvLineNumbers')) {
        if (encodeReq.options.includes('csvHeader')) {
            csv += "#,URL\n";
        }

        for (x = 0; x < encodeReq.urls.length; x++) {

            if (quoteUrl){
                csv += x + ",'" + encodeReq.urls[x] + "'\n";
            }

            else {
                csv += x + ',' + encodeReq.urls[x] + '\n';
            }

        }

    } else {

        if (encodeReq.options.includes('csvHeader')) {
            csv += "URL\n";
        }

        for (x = 0; x < encodeReq.urls.length; x++) {

            if (quoteUrl) {
                csv += "'" + encodeReq.urls[x] + "'\n";
            } else {
                csv += encodeReq.urls[x] + '\n';
            }
        }
    }

    return csv;
}


function encodeUrls(encoder, fileExtension, options = [],
                    outputType = "clipboard") {
    setDebugStatus('Starting encoder');
    const encodeReq = new encodeRequest(getFileName(),
        fileExtension, getUrls(), options, outputType);
    returnUrls(encoder(encodeReq), encodeReq);
}

function returnUrls(text, encodeReq) {
    if (encodeReq.outputType === "saveAsTextFile") {
        saveAsTextFile(text, encodeReq);
    }
    else {
        copyToClipboard(text, encodeReq);
    }
}


function saveAsTextFile(text, encodeReq) {
    setDebugStatus("Saving as text");
    let blob = new Blob([text], {
        type: "text/plain;charset=utf-8"
    });
    saveAs(blob, encodeReq.fileName + '.' + encodeReq.fileExtension);
}


function copyToClipboard(text, encodeReq) {
    setDebugStatus("Coping to clipboard");
    navigator.clipboard.writeText(text)
        .then(() => toast(encodeReq.fileName + " copied to your clipboard successfully."));
}