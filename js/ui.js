bootstrap.Toast.Default.delay = 5000;
const multiFileUrlModal = $("#multiFileUrlModal");
const multiFileUrlNext = $("#multiFileUrlNext");
const multiFileUrlPrev = $("#multiFileUrlPrev");
const multiFileSelectElements = {};
const multiFileSelectCopyButtonElements = {};
let multiFileSelectLock = false;
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

function addMultiUrl(urls, page = 1) {

    if (!multiFileSelectLock) {
        multiFileSelectLock = true;

        let start;

        if (page === 1) {
            start = 1
        } else {
            start = (page * 5) - 5
        }

        let cur = start;
        let elementNum = 1;

        console.log(cur);

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
                element.show();
                copyButton.show();
            } else {
                element.hide();
                copyButton.hide();
            }

            cur += 1;
            elementNum += 1;

            if (element === 6) {
                break;
            }
        }

        multiFileUrlModal.modal('show');

        if (page <= urls.length / 5) {
            multiFileUrlNext.show();
        } else {
            multiFileUrlNext.hide();
        }

        if (page !== 1) {
            multiFileUrlPrev.show();
        } else {
            multiFileUrlPrev.hide();
        }

        multiFileSelectLock = false;

    }
    else {
        console.log("lock hit");
    }


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

function toast(toastBody) {
    $('.toast-body').text(toastBody);
    $('.toast').toast('show');
}

function copyFromMultiSelect(number) {
    let multiFileUrl = $("#multiFileUrl" + number);

        navigator.clipboard.writeText(multiFileUrl.val())
            .then(() => {
                toast("URL #" + number + " copied to your clipboard successfully.");
            })
            .catch(err => {
                toast("URL #" + number + " copied to your clipboard unsuccessfully.");
                console.log('clipboard copy error: ' + err);
            });

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
