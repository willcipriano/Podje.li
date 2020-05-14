bootstrap.Toast.Default.delay = 5000;
const multiFileUrlModal = $("#multiFileUrlModal");
const multiFileUrlNext = $("#multiFileUrlNext");
const multiFileUrlPrev = $("#multiFileUrlPrev");
const multiFileSelectElements = {};
const multiFileSelectCopyButtonElements = {};
let multiUrlCurrentPage = 1;

function populateFileDetails(file) {
    FILEMIME = file.type;
    const lastModified = calculateJSDate(file.lastModified);

    const fileStatSize = $("#fileStatSize");
    const fileStatType = $("#fileStatType");
    const fileStatLastModified = $("#fileStatLastModified");

    fileStatSize.text("Size: " + file.size + " bytes");
    fileStatType.text("Type: " + FILEMIME);
    fileStatLastModified.text("Last Modified: " + (lastModified.getMonth() + 1) + "/" + lastModified.getFullYear());
    flipPanel("fileDetails");

}

function addUrl(url) {
    const singleFileUrl = $("#singleFileUrl");
    const singleFileUrlModal = $("#singleFileUrlModal");

    singleFileUrl.val(url);
    singleFileUrlModal.modal('show');

}

function showAboutModal() {
        const versionInfo = getVersionData();
        const modal = $("#aboutModal");
        const aboutModalTitle = $("#aboutModalTitle");
        const aboutHeader = $("#aboutHeader");

        aboutHeader.tooltip({
            html: true,
            title: "<i>pôdela</i><br><b>Noun</b> - the action of separating something into parts or the process of being separated."
        });

        aboutModalTitle.text("PODJE.LI - Version " + versionInfo.softwareVersion);
        aboutModalTitle.tooltip({
            html: true,
            title: "<b>CODENAME:</b> '<i>" + versionInfo.buildCodename + "</i>'"
        })

        aboutHeader.text("");
        $("#aboutSignOff").html("<br>");

        modal.modal('show');

        const theater = theaterJS();

        theater.addActor('aboutHeader');
        theater.addActor("aboutSignOff");

        theater.addScene("aboutHeader:PODJE.LI");
        theater.addScene("aboutSignOff:" + versionInfo.aboutSignOff);
        theater.play();

}

function showMultiUrlNextPage() {
    multiUrlCurrentPage = multiUrlCurrentPage + 1;
    addMultiUrl(getUrls(), multiUrlCurrentPage);
}

function showMultiUrlPrevPage() {
    multiUrlCurrentPage = multiUrlCurrentPage - 1;
    addMultiUrl(getUrls(), multiUrlCurrentPage);
}

function clearMultiUrlPage() {
    multiUrlCurrentPage = 1;
}

function addMultiUrl(urls, page) {
        let start;

        if (page === 1) {
            start = 1
        } else {
            start = (page * 5) - 4
        }

        let cur = start;
        let elementNum = 1;

        while (cur <= start + 5) {

            let element;
            let copyButton;

            if (!multiFileSelectElements.hasOwnProperty('#multiFileUrl' + elementNum)) {

                element = $('#multiFileUrl' + elementNum);
                copyButton = $('#copyButton' + elementNum);
                multiFileSelectCopyButtonElements['#copyButton' + elementNum] = copyButton;
                multiFileSelectElements['#multiFileUrl' + elementNum] = element;

            } else {

                element = multiFileSelectElements['#multiFileUrl' + elementNum];
                copyButton = multiFileSelectCopyButtonElements['#copyButton' + elementNum];

            }

            if (cur <= urls.length) {
                element.val(urls[cur - 1]);

                if (element.is(":hidden")) {
                    element.show();
                }

                if (copyButton.is(":hidden")) {
                    copyButton.show();
                }

            } else {

                if (element.is(":visible")) {
                    element.hide();
                }

                if (copyButton.is(":visible")) {
                    copyButton.hide();
                }
            }

            cur += 1;
            elementNum += 1;

            if (element === 6) {
                break;
            }
        }

        if (page < urls.length / 5) {

            if (multiFileUrlNext.is(":hidden")) {
                multiFileUrlNext.show();
            }}


        else if (page === urls.length / 5) {
                multiFileUrlNext.hide();
            }

         else {

            if (multiFileUrlNext.is(":visible")) {
                multiFileUrlNext.hide();
            }
        }

        if (page !== 1) {
            if (multiFileUrlPrev.is(":hidden")) {
            multiFileUrlPrev.show(); }

        } else if (page === 1) {
            multiFileUrlPrev.hide();
        }
        else {
            if (multiFileUrlPrev.is(":visible")) {
            multiFileUrlPrev.hide(); }
        }

    multiFileUrlModal.modal('show');
}

function flipPanel(panelName, direction = true) {

    let panel;

    if (panelName === "fileDetails") {
        panel = $("#fileStatPanel");
    } else if (panelName === "fileSelectorPane") {
        panel = $("#fileSelectorPane");
    } else {
        return;
    }

    if (direction) {
        panel.show();
    } else {
        panel.hide();
    }
}


function newFileDetected() {
    const fileToBeSaved = FILESELECTOR[0].files[0];
    populateFileDetails(fileToBeSaved);
}

function cancelDetected() {
    flipPanel('fileDetails', false);
}



function handleMultiPartProcess() {

    if (getQueryParam('pt')) {

        multipartFileProcessRegister();

        if (!detectTotalPartsCompleted()) {
            $('#filePartMessage').text('Multipart File Started');
            $('#filePartDiscoveryModal').modal('show');
        }
    } else if (getQueryParam('mp')) {
        multipartFileProcessAdd();

        if (!detectTotalPartsCompleted()) {
            $('#filePartMessage').text(localStorage.getItem('filename') + ' part ' + getQueryParam('p'));
            $('#filePartDiscoveryModal').modal('show');
        }

    }

}

function displayURLS() {
    $("#fileResultModal").modal("hide");
    $('#urlFileSaveModal').modal("hide");
    addMultiUrl(getUrls(), 1);
}


function showFileResultModal() {
    const modal = $('#fileResultModal');
    const fileResultTotalUrls = $('#fileResultTotalUrls');

    fileResultTotalUrls.text("We can squeeze that into roughly " + getShareUrlsLength() + " URL's.");
    modal.modal('show');
}

function toast(toastBody) {
    $('.toast-body').text(toastBody);
    $('.toast').toast('show');
}

function copyFromMultiSelect(number) {
    let multiFileUrl = $("#multiFileUrl" + number);

        navigator.clipboard.writeText(multiFileUrl.val())
            .then(() => {
                toast("URL #" + (number  + (5 * multiUrlCurrentPage) - 5) + " copied to your clipboard successfully.");
            })
            .catch(err => {
                toast("URL #" + number + " copied to your clipboard unsuccessfully.");

                if (getVersionData().debugMode()) {
                console.log('clipboard copy error: ' + err); }

            });

}

function outputURLS() {

    encodeUrls(basicHTMLEncoder, '.html');

}


function downloadAsCsv() {
    encodeUrls(basicCSVEncoder, '.csv', ['csvHeader', 'csvLineNumbers'], 'saveAsTextFile');
}




function showDebugModal() {

    if (getDebugInit()) {
        const debugStatus = $("#debugStatus");
        const debugMessage = $("#debugMessage");
        const debugModal = $("#debugModal");
        const debugListGroup = $("#debugListGroup");
        const debugMessages = getDebugMessages();

        debugStatus.text(getDebugStatus());
        debugMessage.text(getDebugMessage());

        let x;
        for (x = debugMessages.length - 1; x > 0; x--) {
            debugListGroup.append("<li class='list-group-item'>" + debugMessages[x - 1] + "</li>")
        }

        debugModal.modal("show");
    }
    else {
        alert("debug has not started up yet!");
    }

}

function userFileProcessCompleted(urls) {
    setDebugStatus("File process UI startup");
    clearMultiUrlPage();
    showFileResultModal();
}


function showUrlFileSaveModal() {
    $('#urlFileSaveModalMessage').html("You have <i>" + getShareUrlsLength() + "</i> URL's to store, how should I format them?");
    $("#fileResultModal").modal('hide');
    $("#urlFileSaveModal").modal('show');
}

function showExportMenu() {

    $('#exportType').select2();
    $('#exportHeader').text("We have " + getShareUrlsLength() + " urls for you!");
    flipPanel("fileSelectorPane", false);
    flipPanel('fileDetails', false);
    $(".exportMenu").show();
    $('#fileResultModal').modal('hide');
    multiFileUrlModal.modal('hide');
}

function startSingleExport(exportType, fileExt, options, outputType, compressed = false) {
    let exportOptions = [];
    exportOptions.push("csvHeader");
    exportOptions.push("csvLineNumbers");

    if (compressed) {
        exportOptions.push('compressed');
    }

    switch (exportType) {

        case '.html':
            encodeUrls(basicHTMLEncoder, '.html', exportOptions, outputType);
            break;

        case '.csv':
            encodeUrls(basicCSVEncoder, '.csv', exportOptions, outputType);
            break;

        case '.md':
            encodeUrls(basicMarkdownEncoder, '.md', exportOptions, outputType);
            break;

        case '.txt':
            encodeUrls(basicTextEncoder, '.txt', exportOptions, outputType);
            break;

        case '.flat':
            encodeUrls(basicFlatFileEncoder, '.flat', exportOptions, outputType);
            break;

        default:
            console.log("not implemented")

    }

}

function exportResultsButton() {
    const exportTypes = $('#exportType').select2('data');
    const compressionEnabled = $('#outputTypesCompress').is(':checked');
    const outputTypeCopy = $('#outputTypesCopy').is(':checked');
    let outputType = "saveAsTextFile";

    if (outputTypeCopy) {
        outputType = "clipboard";
    }

    if (exportTypes.length === 1) {
        startSingleExport(exportTypes[0].id, exportTypes[0].id, [], outputType, compressionEnabled)
    }

}

function outputTypeButton(action) {
    const saveCheckbox = $("#outputTypesSave");
    const saveButton = $("#outputTypesSaveButton");
    const compressCheckbox = $("#outputTypesCompress");
    const compressButton = $("#outputTypesCompressButton");
    const copyCheckbox = $("#outputTypesCopy");
    const copyButton = $("#outputTypesCopyButton");
    const exportButton = $("#exportAndButton");

    if (action === 'save') {
        exportButton.prop('disabled', false);
        compressCheckbox.prop('disabled', false);
        compressButton.prop('disabled', false);
        copyCheckbox.prop('checked', false);
        copyButton.removeClass('active');
        exportButton.text('Export & Download');
    }

    if (action === 'copy') {
        exportButton.prop('disabled', false);
        compressCheckbox.prop('disabled', true);
        compressCheckbox.prop('checked', false);
        compressButton.prop('disabled', true);
        saveCheckbox.prop('checked', false);
        saveButton.removeClass('active');
        compressButton.removeClass('active');
        exportButton.text('Export & Copy');
    }

    if (!saveCheckbox.is(':checked') && !copyCheckbox.is(':checked')) {
        exportButton.prop('disabled', true);
    }


        }


$(document).ready(function () {
    setDebugMessage("Starting ui.js initialization");
    let placeholderText;
    let fileSelector = $("#fileSelector");

    if (screen.width <= 434) {
        placeholderText = "Browse!";
    } else {
        placeholderText = "Turn your small file into many big links!";
    }


    fileSelector.fileinput(
        {
            browseClass: "btn btn-success",
            uploadTitle: "Share",
            uploadLabel: "Share",
            uploadClass: "btn btn-outline-success",
            removeTitle: "Cancel",
            removeLabel: "Cancel",
            removeClass: "btn btn-outline-success",
            msgPlaceholder: placeholderText
        }
    );


    if (getQueryParam('n')) {
        $('.successful_upload').show();
    }

    if (getQueryParam('pl')) {
        loadSingleFileFromQueryParam();
    } else {
        $('.file_upload').show();
    }

    fileSelector.on('change', newFileDetected);
    fileSelector.on('fileclear', cancelDetected);

    setDebugMessage("Showing file selector pane");
    flipPanel("fileSelectorPane");

    handleMultiPartProcess();

    setDebugMessage("ui.js initialization completed");
    setDebugStatus("UI initialization completed");
});
