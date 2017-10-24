
/*---------------------------------------
Initial setup
 ---------------------------------------*/

var URL_ENDPOINT = 'http://portal.gabriellispa.it';

//FILTER STRING
var pageSizeFilterTickets=10;
var orderByFilterTickets="+changedate";
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
                console.log(key);
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

function buildDocumentTable(myList, columns, limit, lastIndexDoc) {
    if ($$('.headerTable').length === 0 && myList.length > 0) {
        var headerTr$ = $$('<tr/>');
        for (var i = 0; i < columns.length; i++) {
            headerTr$.append($$('<th class="headerTable"/>').html(columns[i]));
        }
        $$(".data-table > table > thead").append(headerTr$);
    }
    if (myList.length === 0) {
        $$(".data-table > table > thead").empty();
    }

    var filterMyList = [];

    for (var i = lastIndexDoc; i < limit && i < myList.length; i++) {
        filterMyList.push(myList[i]);
    }



    for (var i = 0; i < filterMyList.length; i++) {
        var row$ = $$('<tr/>');
        //DA MODIFICARE L'EMAIL DELLA RISPOSTA CON I VALORI EFFETTIVAMENTE RESTITUITI DAL JSON 
        // PER REVERT SOSTITUIRE EX filterMyList[i].NumeroDocumento CON filterMyList[i].docNumber ECC...
        var cellValue = {'docNumber': filterMyList[i].NumeroDocumento, 'docTitle': filterMyList[i].Title, 'docDate': filterMyList[i].DataDocumento, 'docLinkEmail': filterMyList[i].doclink, 'docPdf_Key_Doc_RISFA': filterMyList[i].ChiaveDocumento,'docPdf_LinkUrl_SHARE_POINT': filterMyList[i].LinkUrl}
        row$.append($$('<td data-collapsible-title="' + columns[0] + '"/>').html('<a href="#" class="doc-info_number">' + cellValue.docNumber + '</a>'));
        row$.append($$('<td data-collapsible-title="' + columns[1] + '"/>').html('<a href="#" class="doc-info_title">' + cellValue.docTitle + '</a>'));
        row$.append($$('<td data-collapsible-title="' + columns[2] + '"/>').html('<a href="#" class="doc-info_date">' + formatDateFromTimeStampToItalian(cellValue.docDate) + '</a>'));
        //valorizzo il link del pdf in modo da distinguere risfa e sharepoint
        var urlToOpenPdf="";

        if(cellValue.docPdf_Key_Doc_RISFA){
            urlToOpenPdf = URL_ENDPOINT+"/AFBNetWS/DocumentFileServlet?jSessionID="+window.sessionStorage.jsessionid+"&KeyDoc_RF="+cellValue.docPdf_Key_Doc_RISFA;         
            row$.append($$('<td data-collapsible-title="' + columns[3] + '"/>').html('<a href="#" class="doc-info_email" data-KeyDoc_RF="' +cellValue.docPdf_Key_Doc_RISFA+ '" data-doc_title="' + cellValue.docTitle + '" data-LinkUrlDocumento_SP=""><i class="f7-icons">email</i></a>'));
        }else if(cellValue.docPdf_LinkUrl_SHARE_POINT){
            urlToOpenPdf = URL_ENDPOINT+"/AFBNetWS/DocumentFileServlet?jSessionID="+window.sessionStorage.jsessionid+"&LinkUrlDocumento_SP="+cellValue.docPdf_LinkUrl_SHARE_POINT;            
            row$.append($$('<td data-collapsible-title="' + columns[3] + '"/>').html('<a href="#" class="doc-info_email" data-KeyDoc_RF="" data-doc_title="' + cellValue.docTitle + '" data-LinkUrlDocumento_SP="'+cellValue.docPdf_LinkUrl_SHARE_POINT+'"><i class="f7-icons">email</i></a>'));
        }
        
     
        row$.append($$('<td data-collapsible-title="' + columns[4] + '"/>').html('<a href="#" class="doc-info_pdf" data-linkpdf="' + urlToOpenPdf + '"><i class="f7-icons">document_text_fill</i></a>'));
        $$(".data-table > table > tbody").append(row$);
    }
        $$('.doc-info_pdf').on('click', function (e) {
         var linkPDF = e.currentTarget.getAttribute("data-linkpdf");
         //myApp.alert('url: '+linkPDF);
         if(linkPDF){
            //var ref = cordova.InAppBrowser.open(linkPDF, '_system', 'location=yes');
          var ref = window.open(linkPDF, '_system', 'location=yes'); 
         }else{
             myApp.alert("Impossibile reperire il Pdf")
         }

    });
        $$('.doc-info_email').on('click', function (e) {
            myApp.showPreloader();
            var title=e.currentTarget.getAttribute("data-doc_title");
            var keyDoc_RF = e.currentTarget.getAttribute("data-KeyDoc_RF");
            var linkUrlDocumento_SP = e.currentTarget.getAttribute("data-LinkUrlDocumento_SP");
            sendDocument(keyDoc_RF, linkUrlDocumento_SP,title);
        });

}
function buildTicketTable(myList, columns, headers, limit, lastIndexDoc) {
    var url;
    var upperLimit =  lastIndexDoc + limit;

    if ($$('.headerTable').length === 0 && myList.length > 0) {
        var headerTr$ = $$('<tr/>');
        for (var i = 0; i < columns.length; i++) {
            headerTr$.append($$('<th class="headerTable"/>').html(headers[i]));
        }
        $$(".data-table > table > thead").append(headerTr$);
    }
    if (myList.length === 0) {
        $$(".data-table > table > thead").empty();
    }

    console.log('index: '+lastIndexDoc+' limit: '+limit + ' count: ' + myList.length + ' upperLimit: ' + upperLimit);
    for (var i = lastIndexDoc; i < upperLimit && i < myList.length; i++) {
        var row$ = $$('<tr/>');
        url = "ticketPage.html?id=" + myList[i].ticketid;
        row$.append($$('<td data-collapsible-title="' + headers[0] + '"/>').html('<a href="'+ url +'" class="doc-info_number">' + myList[i].ticketid + '</a>'));
        row$.append($$('<td data-collapsible-title="' + headers[1] + '"/>').html('<a href="'+ url +'" class="doc-info_title">' + myList[i].externalsystem + '</a>'));
        row$.append($$('<td data-collapsible-title="' + headers[2] + '"/>').html('<a href="'+ url +'" class="doc-info_title">' + myList[i].description + '</a>'));
        row$.append($$('<td data-collapsible-title="' + headers[3] + '"/>').html('<a href="'+ url +'" class="doc-info_title">' + myList[i].status + '</a>'));
        row$.append($$('<td data-collapsible-title="' + headers[4] + '"/>').html('<a href="'+ url +'" class="doc-info_title">' + myList[i].createdby + '</a>'));
        row$.append($$('<td data-collapsible-title="' + headers[5] + '"/>').html('<a href="'+ url +'" class="doc-info_title">' + myList[i].affectedperson + '</a>'));
        row$.append($$('<td data-collapsible-title="' + headers[6] + '"/>').html('<a href="'+ url +'" class="doc-info_title">' + formatDateFromTimeStampToItalian(myList[i].creationdate) + '</a>'));
        $$(".data-table > table > tbody").append(row$);
    }
}

function searchDocWithFilters(docAmountFrom, docAmountTo, dateFrom, dateTo, docContains, limit, lastIndexDoc) {

    docTableData = getDocumentList(docAmountFrom,docAmountTo, dateFrom, dateTo, docContains);
    if(docTableData){
        var documentCount = docTableData.length;
        buildDocumentTable(docTableData, ['Numero', 'Nome', 'Data', 'E-mail', 'PDF'], limit, lastIndexDoc);
        if(documentCount || documentCount === 0){
            $$('.docCount').text(documentCount);
            $$('.documentSearchCount').show();
        }
    }else{
       return;
    }



}
function toFilterTickets(dateFrom, dateTo, status, desc){
    dateFrom = (dateFrom === "") ? '1970-01-01' : dateFrom;
    dateTo = (dateTo === "") ? '2999-01-01' : dateTo;
    var descIfExist = '';
    if(desc !== ''){
       descIfExist  = 'and description="%'+desc+'%"';
    }

    var stringFilters = 'oslc.pageSize='+pageSizeFilterTickets+'&oslc.orderBy='+orderByFilterTickets+'&oslc.select=*&oslc.where=reportedby="'+window.sessionStorage.username+'" and changedate>="'+dateFrom+'" and changedate<="'+dateTo+'" and status="'+status+'"'+descIfExist;
    
    return stringFilters;
}

function formatDateFromItalian(date) {

    var finalDate = '';
    if (date && date !== 'null') {
        var dateArray = date.split("/");
        finalDate = "" + dateArray[2] + "-" + dateArray[1] + "-" + dateArray[0] + "";
    }
    return finalDate;

}
function formatDateFromTimeStampToItalian(timeStamp) {

    var finalDate = 'Data non disponibile';
    if (timeStamp && timeStamp !== 'null') {
        var d= new Date(timeStamp);
        finalDate = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear();
    }
    return finalDate;

}
