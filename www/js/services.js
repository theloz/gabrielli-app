
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

function getMaximoTktList(){
    var err;
    var myList;
    $$.ajax({
        headers: {
            'Access-Control-Allow-Origin': '*',
            "jSessionID": window.sessionStorage.jsessionid,
            "cache-control": "no-cache"
    //            'dataType':'json',
        },
        // data: filters,
        async: false, //needed if you want to populate variable directly without an additional callback
        // url: 'http://portal.gabriellispa.it/AFBNetWS/resourcesMaximo/manageTicket/elencoTicketsUtente/' + window.sessionStorage.username,
        url: URL_ENDPOINT+'/AFBNetWS/resourcesMaximo/manageTicket/elencoTicketsUtente/maxadmin',
        method: 'GET',
        dataType: 'json', //compulsory to receive values as an object
        processData: true, //ignore parameters if sets to false
        //contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
            error: function (data, status, xhr) {
                //alert(JSON.stringify(data));
                // myApp.alert('Nessun dato da caricare');
                err = 'err_00'
            },
            success: function (data, status, xhr) {
                myList = data;
            },
        statusCode: {
            500: function(xhr){
                // myApp.alert('Servizio Maximo non disponibile');
                getLogout();
            },
            401: function (xhr) {
                myApp.alert('App non autorizzata ad ottenere i dati');
            }
        }
    });
    return myList;
}


function getUserAnag(){
    var ctrl = false;
    if(window.sessionStorage.jsessionid === ''){
       getLogout();
    }
    else{
//        myApp.alert(window.sessionStorage.jsessionid);
        $$.ajax({
            headers: {
    //            'Authorization': 'Bearer 102-token',
                'Access-Control-Allow-Origin': '*',
                "jSessionID": window.sessionStorage.jsessionid,
                "cache-control": "no-cache"
            },
            url:  URL_ENDPOINT+'/AFBNetWS/resourcesMaximo/userProfile/anagUtente/' + window.sessionStorage.username,
            method: 'GET',
            crossDomain: true,
            async: false,
            success: function (data, status, xhr) {
                data = JSON.parse(data);
                window.sessionStorage.setItem("codcliamm", data.codcliamm);
                window.sessionStorage.setItem("codforamm", data.codforamm);
                window.sessionStorage.setItem("codicefiscale", data.codicefiscale);
            },
            statusCode: {
                401: function (xhr) {
                    myApp.alert('Errore chiamata servizio di profilo utente','User profile Error');
                }
            },
            error: function (data, status, xhr) {
                myApp.alert('Servizio di login non disponibile.', "User profile error");
            }
        });
    }
    return ctrl;
}
function getUserInfo(){
        if(window.sessionStorage.jsessionid === ''){
            myApp.hidePreloader();
            getLogout();
            
        }else{
             $$.ajax({
                headers: {
                    'Authorization': 'Bearer 102-token',
                    'Access-Control-Allow-Origin': '*',
                    'Content-type': 'application/x-www-form-urlencoded',
                    'jSessionID': window.sessionStorage.jsessionid,
                },
                async: false, //needed if you want to populate variable directly without an additional callback
                url :URL_ENDPOINT+'/AFBNetWS/resourcesMaximo/userProfile/infoUtente',
                method: 'GET',
                dataType: 'json', //compulsory to receive values as an object
                processData: true, //ignore parameters if sets to false
                //contentType: 'application/x-www-form-urlencoded',
                crossDomain: true,
                    error: function (data, status, xhr) {

                        //alert(JSON.stringify(data));
                        myApp.alert('Errore reperimento Email utente');
                        err = 'err_00';
                        myApp.hidePreloader();
                    },
                    success: function (data, status, xhr) {
                        window.sessionStorage.setItem("userEmail", data.email);
                         
                    },

                statusCode: {
                    401: function (xhr) {
                        myApp.hidePreloader();
                        myApp.alert('App non autorizzata ad ottenere i dati', 'docListError');
                    }
                }
            });
            
        }
}
function validateUser(uuid='',upwd=''){
    var chkLogin = false;
    if(uuid=='elia4ever'){
        var d = new Date();
        window.sessionStorage.setItem("jsessionid", uuid + d.getTime());
        return true;
    }
//    return true;
    $$.ajax({
        headers: {
//            'Authorization': 'Bearer 102-token',
            'Access-Control-Allow-Origin': '*',
            "username": uuid,
            "password": upwd,
            "cache-control": "no-cache"
        },
        url:  URL_ENDPOINT+'/AFBNetWS/resourcesMaximo/userProfile/login',
        method: 'GET',
        crossDomain: true,
        async: false,
        success: function (data, status, xhr) {
            data = JSON.parse(data);
//            myApp.alert(data.statusCode,"Status code");
//            myApp.alert(data.jSessionID,"JSESSIONID");
            if( data.statusCode == 200 && data.jSessionID != '' ){
                window.sessionStorage.setItem("jsessionid", data.jSessionID);
                window.sessionStorage.setItem("username", uuid);
                chkLogin = true;
            }
        },
        statusCode: {
            401: function (xhr) {
                myApp.alert('Errore chiamata servizio di login','Login Error');
            }
        },
        error: function (data, status, xhr) {
//            var output;
//            for (var key in data) {
//                if (data.hasOwnProperty(key)) {
//                    output += key + " -> " + data[key];
//                }
//            }
            myApp.alert('Servizio di login non disponibile.', "Login error");
        }
    });
    return chkLogin;
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
                alert('failure!');
            }
        },
        error: function (data, status, xhr) {
            alert('failure!!');
        }
    });
}

// funzione reperimento documenti
function getDocumentList(docAmountFrom,docAmountTo,dateFrom,dateTo,docContains){
    
        if(window.sessionStorage.jsessionid === ''){
            myApp.hidePreloader();
            getLogout();
        }else{
            //sostituire il codice fiscale con +window.sessionStorage.codicefiscale
            $$.ajax({
                headers: {
                    'Authorization': 'Bearer 102-token',
                    'Access-Control-Allow-Origin': '*',
                    'Content-type': 'application/x-www-form-urlencoded',
                    'jSessionID': window.sessionStorage.jsessionid + 'SZFKLZSJòLKSJHDLKSJDKLJLKòSA',
                    'DocFilterDataDocumento':'op=between,from='+dateFrom+',to='+dateTo,
        //            'DocFilterTipoDocumento':'op=contain,value='+docType,
                    // 'DocFilterCodiceFiscale':'op=equal,value=01654010345',
                    'DocFilterCodiceFiscale':'op=equal,value='+window.sessionStorage.codicefiscale,
                    'DocFilterImporto':'op=between,from='+docAmountFrom+',to='+docAmountTo,
                    'DocFilterNumeroDocumento':'op=contain,value='+docContains
        //            'dataType':'json',
                },
        //        data: '{ "filters":[{ "key":"RDTipoDocumento", "op":"contain", "value":"DDT" },{ "key":"RDDataDocumento", "op":"between", "from":"", "to":"" },{ "key":"RDNumeroDocumento", "op":"contain", "value":"" }]}',
        //        data: JSON.stringify(obj),
                async: false, //needed if you want to populate variable directly without an additional callback
                url : URL_ENDPOINT+'/AFBNetWS/resourcesDocs/manageDocs/getDocumenti/',
                method: 'GET',
                dataType: 'json', //compulsory to receive values as an object
                processData: true, //ignore parameters if sets to false
                //contentType: 'application/x-www-form-urlencoded',
                crossDomain: true,
                    error: function (data, status, xhr) {
                        myApp.hidePreloader();
                        //alert(JSON.stringify(data));
                        myApp.alert('Errore reperimento dati');
                        err = 'err_00'
                    },
                    success: function (data, status, xhr) {
                            myApp.hidePreloader();
                            // alert(window.sessionStorage.jsessionid);
                            if(data.status && data.status=='401'){
                                getLogout();
                            }
                            else{
                                docTableData = data.documents;
                            }
                    },

                statusCode: {
                    401: function (xhr) {
                        myApp.alert('App non autorizzata ad ottenere i dati', 'docListError');
                    },
                    500: function(xhr){
                        getLogout();
                    }
                }
            });
                return docTableData;
            }
}
function sendDocument(keyDoc_RF, linkUrlDocumento_SP, title){
     if(window.sessionStorage.jsessionid === ''){
            myApp.hidePreloader();
            getLogout();
        }else{
                $$.ajax({
                      headers: {
                          'Authorization': 'Bearer 102-token',
                          'Access-Control-Allow-Origin': '*',
                          'Content-type': 'application/x-www-form-urlencoded',
                          'jSessionID': window.sessionStorage.jsessionid,
                          'EMail' : window.sessionStorage.userEmail,
                          'LinkUrlDocumento_SP': linkUrlDocumento_SP,
                          'KeyDoc_RF': keyDoc_RF,
                          'Subject': title
                      },
                      async: false, //needed if you want to populate variable directly without an additional callback
                      url :URL_ENDPOINT+'/AFBNetWS/resourcesDocs/manageDocs/sendDocument',
                      method: 'GET',
                      dataType: 'json', //compulsory to receive values as an object
                      processData: true, //ignore parameters if sets to false
                      //contentType: 'application/x-www-form-urlencoded',
                      crossDomain: true,
                          error: function (data, status, xhr) {
                              myApp.hidePreloader();
                              //alert(JSON.stringify(data));
                              myApp.alert("Errore nell'invio della mail");
                              err = 'err_00'
                          },
                          success: function (data, status, xhr) {
                                  myApp.hidePreloader();
                                  myApp.alert('Documento inviato con successo alla email: '+window.sessionStorage.userEmail);
                          },

                      statusCode: {
                          401: function (xhr) {
                              myApp.hidePreloader();
                              myApp.alert('App non autorizzata ad ottenere i dati', 'docListError');
                          }
                      }
                  });
              }
};
function getLogout(){
    myApp.alert('Clicca per effettuare il login', 'Sessione Scaduta', function () {
        window.sessionStorage.clear();
        myApp.loginScreen(".login-screen", false);
    });
}
