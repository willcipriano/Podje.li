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
    return txt.slice(0, -1);
}


function basicFlatFileEncoder(encodeReq) {
    let x;
    let flat = '';

    for (x = 0; x < encodeReq.urls.length; x++) {
        flat += encodeReq.urls[x] + "\n"
    }
    return flat.slice(0, -1);
}

function basicHTMLEncoder(encodeReq) {
    let html = '<h2>podje.li file:' + encodeReq.fileName + '</h2>\n';
    let x;

    for (x = 0; x < encodeReq.urls.length; x++) {
        html += "<p><a href='" + encodeReq.urls[x] + "'>Part " + (x + 1) + "</a></p>\n";
    }
    return html.slice(0, -1);
}


function basicMarkdownEncoder(encodeReq) {
    let markdown = '# podje.li file:' + encodeReq.fileName + '\n';
    let x;

    for (x = 0; x < encodeReq.urls.length; x++) {
        markdown += "* [Part " + (x + 1) + "](" + encodeReq.urls[x] + ")\n"
    }
    return markdown.slice(0, -1);
}

function basicCSVEncoder(encodeReq) {
    let csv = "";
    let x;
    const quoteUrl = encodeReq.options.includes('csvQuoteURL');
    const excelStyleUrl = encodeReq.options.includes('csvExcelURL');


    if (encodeReq.options.includes('csvLineNumbers')) {
        if (encodeReq.options.includes('csvHeader')) {
            csv += "#,URL\n";
        }

        for (x = 0; x < encodeReq.urls.length; x++) {

            if (quoteUrl){
                csv += (x + 1) + ",'" + encodeReq.urls[x] + "'\n";
            }
            else {
                csv += (x + 1) + ',' + encodeReq.urls[x] + '\n';
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
    return csv.slice(0, -1);
}


function encodeUrls(encoder, fileExtension, options = [],
                    outputType = "clipboard") {
    const encodeReq = new encodeRequest(getFileName(),
        fileExtension, getUrls(), options, outputType);
    setExportProgress(25);
    returnUrls(encoder(encodeReq), encodeReq);
}


function returnUrls(text, encodeReq) {
    setExportProgress(42);
    if (encodeReq.outputType === "saveAsTextFile") {
        saveAsTextFile(text, encodeReq);
    }
    else {
        copyToClipboard(text, encodeReq);
    }
}


function saveAsTextFile(text, encodeReq) {

    if (encodeReq.options.includes('compressed')) {
        let zip = new JSZip();
        zip.file(encodeReq.fileName + encodeReq.fileExtension, text);
        setExportProgress(52);
        zip.generateAsync({
            type:"blob",
            compression: "DEFLATE",
            compressionOptions: {
                level: 9
            }})
            .then(function(content) {
                saveAs(content, encodeReq.fileName + encodeReq.fileExtension + '.zip');
            }).then(() => setExportProgress(100));
    }
    else {
        let blob = new Blob([text], {
            type: "text/plain;charset=utf-16"
        });
        setExportProgress(52);
    saveAs(blob, encodeReq.fileName + encodeReq.fileExtension);
        setExportProgress(100); }
}


function copyToClipboard(text, encodeReq) {
    setExportProgress(52);
    navigator.clipboard.writeText(text)
        .then(() => toast(encodeReq.fileName + " copied to your clipboard successfully."));
    setExportProgress(100);
}