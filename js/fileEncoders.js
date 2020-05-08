class encodeRequest {

    constructor(filename, fileExtension, urls, options, outputType) {
        this.fileName = filename;
        this.fileExtension = fileExtension;
        this.urls = urls;
        this.options = options;
        this.outputType = outputType;
    }

}


function basicTextEncoder(encodeReq) {
    let txt = "podje.li file: " + encodeReq.fileName + '\n';
    let x;

    for (x = 0; x < encodeReq.urls.length; x++) {
        txt += "Part " + (x + 1) + ": " + encodeReq.urls[x] + "\n"
    }
    return txt;
}


function basicHTMLEncoder(encodeReq) {
    let html = '<h2>podje.li file:' + encodeReq.fileName + '</h2>\n';
    let x;

    for (x = 0; x < encodeReq.urls.length; x++) {
        html += "<p><a href='" + encodeReq.urls[x] + "'>Part " + (x + 1) + "</a></p>\n";
    }
    return html;
}


function basicMarkdownEncoder(encodeReq) {
    let markdown = '# podje.li file:' + encodeReq.fileName + '\n';
    let x;

    for (x = 0; x < encodeReq.urls.length; x++) {
        markdown += "* [Part " + (x + 1) + "](" + encodeReq.urls[x] + ")\n"
    }
    return markdown;
}

function basicCSVEncoder(encodeReq) {
    let csv = "";
    let x;
    const quoteUrl = encodeReq.options.includes('csvQuoteURL');
    const excelStyleUrl = encodeReq.options.includes('csvExcelURL');

    console.log(excelStyleUrl);

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
    let blob = new Blob([text], {
        type: "text/plain;charset=utf-8"
    });
    if (encodeReq.options.includes('compressed')) {
        let zip = new JSZip();
        zip.file(encodeReq.fileName + encodeReq.fileExtension, text);
        zip.generateAsync({type:"blob"})
            .then(function(content) {
                saveAs(content, encodeReq.fileName + encodeReq.fileExtension + '.zip');
            });
    }
    else {
    saveAs(blob, encodeReq.fileName + encodeReq.fileExtension); }
}


function copyToClipboard(text, encodeReq) {
    navigator.clipboard.writeText(text)
        .then(() => toast(encodeReq.fileName + " copied to your clipboard successfully."));
}