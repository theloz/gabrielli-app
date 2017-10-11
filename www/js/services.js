
//Causa problemi se inserito in util

//Services
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
    return myList;
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
}

// funzione reperimento documenti
function getDocumentList(docType,dateFrom,dateTo,docContains){
    
//    var obj = {};
//    obj.filters = [
//    {
//        'key': 'RDTipoDocumento',
//        'value': "",
//        'op': 'contain'  //contains or equals
//    },
//    {
//        'key': 'RDDataDocumento',
//        'from': dateFrom,
//        'to': dateTo,
//        'op': 'between'
//    },
//
//    {
//        'key': 'RDNumeroDocumento',
//        'value': docContains,
//        'op': 'contain'  //contains or equals
//    }];

    
    $$.ajax({
        headers: {
            'Authorization': 'Bearer 102-token',
            'Access-Control-Allow-Origin': '*',
            'Content-type': 'application/x-www-form-urlencoded',
            'DocFilterDataDocumento':'op=between,from='+dateFrom+',to='+dateTo,
//            'DocFilterTipoDocumento':'op=contain,value='+docType,
            'DocFilterNumeroDocumento':'op=contain,value='+docContains 
//            'dataType':'json',
        },
//        data: '{ "filters":[{ "key":"RDTipoDocumento", "op":"contain", "value":"DDT" },{ "key":"RDDataDocumento", "op":"between", "from":"", "to":"" },{ "key":"RDNumeroDocumento", "op":"contain", "value":"" }]}',
//        data: JSON.stringify(obj),
        async: false, //needed if you want to populate variable directly without an additional callback
//        url: 'http://192.168.3.9/v2/ttm/listfilters',
        url: 'http://192.168.3.9/v2/docs/listfilters',
        method: 'GET',
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
                docTableData = data;
            },
        statusCode: {
            401: function (xhr) {
                myApp.alert('App non autorizzata ad ottenere i dati', 'docListError');
            }
        }
    });
    return docTableData;
}