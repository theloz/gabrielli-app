
//Causa problemi se inserito in util

//Services
function getTktDataByFilter(offset = '', limit = '', filter = null, sort = null) {
    var filters = {};
    //alert('offset: '+offset+' limit: '+limit);
    if (offset != '') {
        filters.offset = offset;
    }
    if (limit != '') {
        filters.limit = limit;
    }
    if (filter != null) {
        var fooFilter = {};
        Object.keys(filter).forEach(function (key) {
            //console.log(key, filter[key]);
            fooFilter[key] = filter[key];
        });
        filters.filter = fooFilter;
        //console.log(filters.filter);
    }
    if (sort != null) {
        var fooSort = {};
        Object.keys(sort).forEach(function (key) {
            //console.log(key, filter[key]);
            fooSort[key] = sort[key];
        });
        filters.sort = fooSort;
        //console.log(filters.filter);
    }

    $$(document).on('ajaxStart', function (e) {
        var xhr = e.detail.xhr;
        xhr.setRequestHeader('Authorization', 'Bearer 102-token');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    });
    $$.post('http://192.168.3.9/v1/ttm/listfilters', filters, function (response) {
        //console.log(response);
        return response;
    });
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
//    $$.post('http://192.168.3.9/filemanage/postfile', img, function (response) {
//        console.log(JSON.stringify(response));
//    });

}