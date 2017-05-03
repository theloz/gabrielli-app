//Table construction
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
function getTktDataByFilter( offset='' , limit='', filter=null, sort=null ){
//    console.log('getTktDataByFilter -> Inizio elaborazione');
    var err;
    var filters = {};
    //alert('offset: '+offset+' limit: '+limit);
    if( offset != '' ){
        filters.offset = offset;
    }
    if( limit != '' ){
        filters.limit = limit;
    }
    if( filter != null ){
        var fooFilter = {};
        Object.keys(filter).forEach(function(key) {
            //console.log(key, filter[key]);
            fooFilter[key] = filter[key];
        });
        filters.filter = fooFilter;
        //console.log(filters.filter);
    }
    if( sort != null ){
        var fooSort = {};
        Object.keys(sort).forEach(function(key) {
            //console.log(key, filter[key]);
            fooSort[key] = sort[key];
        });
        filters.sort = fooSort;
        //console.log(filters.filter);
    }
//    alert(filters['limit']);
//    $$(document).on('ajax:start', function(e){
//        var xhr = e.detail.xhr;
//        xhr.setRequestHeader('Authorization', 'Bearer 102-token');
//        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//    });
    $$.ajax({
        headers: {
            'Authorization': 'Bearer 102-token',
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/x-www-form-urlencoded',
//            'dataType':'json',
        },
        data: filters,
        async: false, //needed if you want to populate variable directly without an additional callback
        url: 'http://192.168.3.9/v2/ttm/listfilters',
        method: 'POST',
        dataType: 'json', //compulsory to receive values as an object
        processData: true, //ignore parameters if sets to false
        //contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
            error: function (data, status, xhr) {
                //alert(JSON.stringify(data));
                myApp.alert('Nessun dato da caricare');
                err = 'err_00'
            },
            success: function (data, status, xhr) {
                myList = data;
            },
        statusCode: {
            401: function (xhr) {
                alert('App non autorizzata ad ottenere i dati');
            }
        }
    });
    
//    $$(document).on('ajaxStart', function(e){
//        var xhr = e.detail.xhr;
//        xhr.setRequestHeader('Authorization', 'Bearer 102-token');
//        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//    });
//    var lista;
//    $$.post(
//            'http://192.168.3.9/v1/ttm/listfilters', 
//            filters, 
////            function (data, status, xhr) {
////                console.log('chiamata xhr');
////                //callback(data);
////                lista = data;
////                //return response;
////            },
//    );
//    console.log('ajax-call outside');
//    $$(document).on('ajax:complete', function (e) {
//        var xhr = e.detail.xhr;
//        console.log('request performed');
//    });
   return myList;
}

function onPhotoDataSuccess(imageData) {
    // Get image handle
//    var smallImage = document.getElementById('small-image');
//    // Unhide image elements
//    smallImage.style.display = 'block';
//    // Show the captured photo
//    // The inline CSS rules are used to resize the image
//    smallImage.src = ";

    var smallImage = $$('#small-image');
    // Unhide image elements
    smallImage.css("display", "block");
    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //smallImage.attr("src", imageData);
    smallImage.attr("src", "data:image/jpeg;base64," + imageData);
}

// Called when a photo is successfully retrieved
function onPhotoFileSuccess(imageData) {
    // Get image handle
    var smallImage = $$('#small-image');
    // Unhide image elements
    smallImage.css("display", "block");
    // Show the captured photo
    // The inline CSS rules are used to resize the image
    smallImage.attr("src", imageData);
}

// Called when a photo is successfully retrieved
function onPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI 
    // console.log(imageURI);
    // Get image handle
    var largeImage = document.getElementById('large-image');
    // Unhide image elements
    largeImage.style.display = 'block';
    // Show the captured photo
    // The inline CSS rules are used to resize the image
    largeImage.src = imageURI;
}

// A button will call this function
function capturePhotoWithData() {
    var option = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL, //Return Base64
        sourceType: Camera.PictureSourceType.CAMERA,
        mediaType: Camera.MediaType.PICTURE,
        encodingType: Camera.EncodingType.JPEG,
    }
    // Take picture using device camera and retrieve image as base64-encoded string
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, option);
}
function capturePhotoWithFile() {
    var option = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL, //Return Base64
        sourceType: Camera.PictureSourceType.CAMERA,
        mediaType: Camera.MediaType.PICTURE,
        encodingType: Camera.EncodingType.JPEG,
    }
    navigator.camera.getPicture(onPhotoFileSuccess, onFail, {quality: 50, destinationType: Camera.DestinationType.FILE_URI});
};

// A button will call this function
function getPhoto(source) {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source});
}
// Called if something bad happens.
function onFail(message) {
    alert('Failed because: ' + message);
}



function uploadFoto() {
    var img = {};
    img = {
        "titolo": "pippo",
        "des": "pluto"
    };
    $$.ajax({
        headers: {
            'Authorization': 'Bearer 102-token',
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'multipart/form-data',
        },
        url: 'http://192.168.3.9/filemanage/postfile',
        method: 'POST',
        crossDomain: true,
        data: img,
        success: function (data, status, xhr) {
            alert("success");
        },
        statusCode: {
            401: function (xhr) {
                alert('Macchettecarichi!');
            }
        },
        error: function (data, status, xhr) {
            alert('errore distruzione di massa!!');
        }
    });
//    $$.post('http://192.168.3.9/filemanage/postfile', img, function (response) {
//        console.log(JSON.stringify(response));
//    });

}
