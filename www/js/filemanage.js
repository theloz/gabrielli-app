function startFile(data){
    window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {
        console.log('file system open: ' + fs.name);
        var blob = new Blob([data],{ type: 'application/pdf'});
        // getSampleFile(fs.root);
        alert(blob.type);
        saveFile(fs.root,blob,'myfile.pdf');
    }, fileErrorHandler);

}

function getSampleFile(dirEntry) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://cordova.apache.org/static/img/cordova_bot.png', true);
    xhr.responseType = 'blob';

    xhr.onload = function() {
        if (this.status == 200) {

            var blob = new Blob([this.response], { type: 'image/png' });
            saveFile(dirEntry, blob, "downloadedImage.png");
        }
    };
    xhr.send();
}
function saveFile(dirEntry, fileData, fileName) {

    dirEntry.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {

        writeFile(fileEntry, fileData);

    }, fileErrorHandler);
}
function writeFile(fileEntry, dataObj, isAppend) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
            if (dataObj.type == "text/plain") {
                readFile(fileEntry);
            }
            else {
                readBinaryFile(fileEntry);
            }
        };

        fileWriter.onerror = function(e) {
            console.log("Failed file write: " + e.toString());
        };

        fileWriter.write(dataObj);
    });
}
function readBinaryFile(fileEntry) {

    fileEntry.file(function (file) {
        var reader = new FileReader();

        reader.onloadend = function() {

            console.log("Successful file write: " + this.result);
            // displayFileData(fileEntry.fullPath + ": " + this.result);
            window.open(fileEntry.toURL(),'_system','location=yes');
            // var blob = new Blob([new Uint8Array(this.result)], { type: "application/pdf" });
            // displayImage(blob);
        };

        reader.readAsArrayBuffer(file);

    }, fileErrorHandler);
}
function displayImage(blob) {

    // Displays image if result is a valid DOM string for an image.
    var elem = document.getElementById('imageFile');
    // Note: Use window.URL.revokeObjectURL when finished with image.
    elem.src = window.URL.createObjectURL(blob);
}

//ERROR HANDLING
function fileErrorHandler(e) {
  var msg = 'File Error handling: ';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg += 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg += 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg += 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg += 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg += 'INVALID_STATE_ERR';
      break;
    default:
      msg += 'Unknown Error';
      break;
  };

  myApp.alert('Error: ' + msg);
}
