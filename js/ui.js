bootstrap.Toast.Default.delay = 5000;


function populateFileDetails(file) {

    FILEMIME = file.type;
    const lastModified = calculateJSDate(file.lastModified);

    const fileStatSize = $("#fileStatSize");
    const fileStatType = $("#fileStatType");
    const fileStatLastModified = $("#fileStatLastModified");

    fileStatSize.text("Size: " + file.size + " bytes");
    fileStatType.text("Type: " + FILEMIME);
    fileStatLastModified.text("Last Modified: " + lastModified.getMonth() + "/" + lastModified.getFullYear());
    flipPanel("fileDetails");

}

function addUrl(url) {

    const singleFileUrl = $("#singleFileUrl");
    const singleFileUrlModal = $("#singleFileUrlModal");

    singleFileUrl.val(url);
    singleFileUrlModal.modal('show');

}

function addMultiUrl(urls) {

    const multiFileUrlModal = $("#multiFileUrlModal");

    let x = 1;

    while (x <= urls.length && x <= 5) {
        element = $('#multiFileUrl' + x);
        element.val(urls[x - 1]);
        element.show();
        $('#copyButton' + x).show();
        x += 1;
    }

    multiFileUrlModal.modal('show');
}

function closeMultiModal() {

    const multiFileUrlModal = $("#multiFileUrlModal");

    let x = 1;

    while (x <= 5) {

        element = $('#multiFileUrl' + x);
        element.val('');
        element.hide();
        $('#copyButton' + x).hide();
        x += 1;
    }

    multiFileUrlModal.modal('hide');




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

function toast(toastBody){
        $('.toast-body').text(toastBody);
        $('.toast').toast('show');
}

function copyFromMultiSelect(number) {
    $("multiFileUrl" + number).select();
    document.execCommand("copy");
    toast("URL #" + number + " copied to your clipboard successfully.");
}



$(document).ready(function () {

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

    flipPanel("fileSelectorPane");

    handleMultiPartProcess();

});

