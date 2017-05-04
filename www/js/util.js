/*---------------------------------------
            Table Construction
 ---------------------------------------*/
function buildHtmlTable(myList) {
    var columns = addAllColumnHeaders(myList);
    buildHtmlTableBody(myList, columns);
}
function buildHtmlTableBody(myList, columns) {
    for (var i = 0; i < myList.length; i++) {
        var row$ = $$('<tr/>');
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var cellValue = myList[i][columns[colIndex]];
            if (cellValue === null) {
                cellValue = "";
            }
            row$.append($$('<td data-collapsible-title="' + [columns[colIndex]] + '"/>').html('<a href="ticketPage.html?id=' + myList[i][columns[0]] + '" class="ticket-info">' + cellValue + '</a>'));
        }
        $$(".data-table > table > tbody").append(row$);
    }
}
function addAllColumnHeaders(myList) {
    var columnSet = [];
    var headerTr$ = $$('<tr/>');
    for (var i = 0; i < myList.length; i++) {
        var rowHash = myList[i];
        for (var key in rowHash) {
            if ($.inArray(key, columnSet) === -1) {
                columnSet.push(key);
                headerTr$.append($$('<th/>').html(key));
            }
        }
    }
    $$(".data-table > table > thead").append(headerTr$);
    return columnSet;
}

/*---------------------------------------
                Fotocamera
 ---------------------------------------*/
function onPhotoDataSuccess(imageData) {
    var smallImage = $$('#small-image');
    smallImage.css("display", "block");
    smallImage.attr("src", "data:image/jpeg;base64," + imageData);
}
// Called when a photo is successfully retrieved
function onPhotoFileSuccess(imageData) {
    var smallImage = $$('#small-image');
    smallImage.css("display", "block");
    smallImage.attr("src", imageData);
}
// Called when a photo is successfully retrieved
function onPhotoURISuccess(imageURI) {
    var largeImage = document.getElementById('large-image');
    largeImage.style.display = 'block';
    largeImage.src = imageURI;
}
// A button will call this function
function capturePhotoWithData() {
    var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL, //Return Base64
        sourceType: Camera.PictureSourceType.CAMERA,
        mediaType: Camera.MediaType.PICTURE,
        encodingType: Camera.EncodingType.JPEG,
    };
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, options);
}
function capturePhotoWithFile() {
    var options = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI, //Return Base64
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        mediaType: Camera.MediaType.ALLMEDIA,
    };
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, options);
}
// A button will call this function
function getPhoto(source) {
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source});
}
function onFail(message) {}
