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
    console.log(myList);
    console.log(typeOf(myList));
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
function getTktDataByFilter( offset='' , limit='', filter=null, sort=null){
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
    /*$$.ajax({
        headers: {
            'Authorization': 'Bearer 102-token',
            'Access-Control-Allow-Origin': '*',
            //'Content-type': 'multipart/form-data',
            //'dataType':'json',
        },
        data: filters,
        url: 'http://192.168.3.9/v1/ttm/listfilters',
        method: 'GET',
        processData: false,
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
            error: function (data, status, xhr) {
                //alert(JSON.stringify(data));
                myApp.alert('Nessun dato da caricare');
                return 'err_00';
            },
            success: function (data, status, xhr) {
                console.log(data);
                //alert("success");
                return data;
            },
        statusCode: {
            401: function (xhr) {
                alert('App non autorizzata ad ottenere i dati');
            }
        }
    });*/
    
    $$(document).on('ajaxStart', function(e){
        var xhr = e.detail.xhr;
        xhr.setRequestHeader('Authorization', 'Bearer 102-token');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    });
    
    $$.post('http://192.168.3.9/v1/ttm/listfilters', filters, function (response) {
        //console.log(response);
        return response;
    });
}
