// Initialize app
var myApp = new Framework7({template7Pages: true,});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
//Configuration for Camera
var pictureSource;
var destinationType;

//Configuration for Infinite Scrolling
var loading = false;
var lastIndex;
// Max items to load 
var maxItems = 50;
// Append items per load
var itemsPerLoad = 10;

$$.ajaxSetup({headers: {'Access-Control-Allow-Origin': '*'}});
var mainView = myApp.addView('.view-main', {dynamicNavbar: true,});

$$(document).on('deviceready', function () {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
      //Necessarie per navigare il file system  
//    myPath = cordova.file.externalRootDirectory;
//    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
});

/*---------------------------------------
              On ALL pages
 ---------------------------------------*/
//Before Init
myApp.onPageBeforeInit('*', function (page) {
    //Check if user is logged in retrieving user from session 
    if (typeof window.sessionStorage.authorized !== 'undefined' &&
            window.sessionStorage.authorized !== null &&
            window.sessionStorage.authorized !== "") {
        myApp.closeModal(".login-screen", false);
    } else {
        myApp.loginScreen(".login-screen", false);
    }
});
//Init for every page
myApp.onPageInit("*", function () {});

/*---------------------------------------
              On EACH page
 ---------------------------------------*/

//INDEX
var index = myApp.onPageInit('index', function () {
    //In caso di refresh  elimina fa auto-login
    if (typeof window.sessionStorage.authorized !== 'undefined' &&
            window.sessionStorage.authorized !== null &&
            window.sessionStorage.authorized !== "") {
        myApp.closeModal(".login-screen", false);
    } else {
        myApp.loginScreen(".login-screen", false);
    }
    
    $$("#box-welcome").html("Benvenuto " + window.sessionStorage.username);
    $$("#btn-logout").click(function () {
        window.sessionStorage.clear();
        myApp.loginScreen(".login-screen", false);
    });
    $$("#btn-login").click(function () {
        var formLogin = myApp.formGetData('frm-login');
        //Get Form Login
        var chkLogin;
        chkLogin = validateUser(formLogin.username, formLogin.password);
//        myApp.alert('chklogin value: '+chkLogin);
        
        if(chkLogin){
            window.sessionStorage.setItem("username", formLogin.username);  //Set user in session
            window.sessionStorage.setItem("authorized", 1);                 //Set token auth
            myApp.closeModal(".login-screen", false);                              //Close login screen
//            console.log("Logged!");
            getUserAnag();
            myApp.alert(window.sessionStorage.codicefiscale);
        }
        else{
            myApp.alert("User name o password errati","Login error");
        }
//        if (formLogin.username === "asd") {
//            window.sessionStorage.setItem("username", formLogin.username);  //Set user in session
//            window.sessionStorage.setItem("authorized", 1);                 //Set token auth
//            myApp.closeModal(".login-screen", false);                              //Close login screen
//            console.log("Logged!");
//        }
    });
    
    $$("#btn-test").click(function () {
        $$.ajax({
            headers: {
                'Authorization': 'Bearer 102-token',
                'Access-Control-Allow-Origin': '*',
                'Content-type': 'multipart/form-data',
                'dataType': 'json',
            },
            url: 'http://192.168.3.9/v2/ttm/list',
            method: 'GET',
            crossDomain: true,
            success: function (data, status, xhr) {
                alert("success");
            },
            statusCode: {
                401: function (xhr) {
                    alert('Non autorizzato');
                }
            }
        });
    });
}).trigger();

//MANAGE TICKET
var manage_ticket = myApp.onPageInit('manage_ticket', function (page) {
    //Pull to refresh
    var ptrContent = $$('.pull-to-refresh-content');
    ptrContent.on('ptr:refresh', function (e) {
        setTimeout(function () {
            myApp.pullToRefreshDone();
            manage_ticket.trigger();
        }, 1000);
    });

    var filter = {
        "stato":"aperto",
//        "titolo":"pippo",
    };
    var sort = {
        "id" : "desc",
    };
    //var myList = getTktDataByFilter('0','10',filter, sort);
    var myList;
    myList = getTktDataByFilter(lastIndex, itemsPerLoad, filter, sort);

    buildHtmlTable(myList);
    lastIndex = itemsPerLoad + 1;
    
    $$('.infinite-scroll').on('infinite', function () {
        // Exit, if loading in progress
        if (loading)
            return;
        // Set loading flag
        loading = true;
        // Emulate 0.5s loading
        setTimeout(function () {
            // Reset loading flag
            loading = false;
            if ( lastIndex >= maxItems ) {
                // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
                myApp.detachInfiniteScroll($$('.infinite-scroll'));
                // Remove preloader
                $$('.infinite-scroll-preloader').remove();
                return;
            }
            var newList;
            newList = getTktDataByFilter(lastIndex, itemsPerLoad, filter, sort);
            buildHtmlTableBody(newList, ["id", "titolo", "descrizione", "stato", "utente","fornitore","dttm"]);
            lastIndex = lastIndex + itemsPerLoad;
        }, 500);
    });
    $$(".ticket-info").click(function () {
    });
});

//NEW TICKET
var new_tkt = myApp.onPageInit("new_tkt", function () {
    $$("#btn-camera-upload").click(function () {
        capturePhotoWithData();
        //uploadFoto();
    });
    $$("#btn-attachment-upload").click(function () {
        //Browse device app FileSystem on iOS
        //listPath(myPath);
        
        //To browse only photo on iOS
        //capturePhotoWithFile();
    });
});

//DETAIL TICKET 
var ticketPage = myApp.onPageInit('ticketPage', function (page) {
    var ticketId = page.query.id;
    $$.getJSON('http://192.168.3.9/v1/ttm/oneticket?id=' + ticketId + '', function (json) {
        $$("#testRest").html(JSON.stringify(json));
    });
});

//Funzioni per il caricamento da file system
//function listPath(myPath) {
//    var backLink = '<div onclick="listPath(' + "'" + myPath + "'" + ');" >' + myPath + '</div>';
//    $$(".popup-filebrowser .title").html(backLink);
//    window.resolveLocalFileSystemURL(myPath, function (dirEntry) {
//        var directoryReader = dirEntry.createReader();
//        directoryReader.readEntries(onSuccessCallback, onFailCallback);
//    });
//}

//function onSuccessCallback(entries) {
//    var html = '';
//    for (i = 0; i < entries.length; i++) {
//        var row = entries[i];
//        if (row.isDirectory) {
//            // We will draw the content of the clicked folder
//            html += '<li onclick="listPath(' + "'" + row.nativeURL + "'" + ');" class="directory"><i class="icons f7-icons">folder</i>' + row.name + '</li>';
//        } else {
//            // alert the path of file
//            html += '<li onclick="getFilepath(' + "'" + row.nativeURL + "'" + ');" class="file"><i class="icons f7-icons">tags</i>' + row.name + '</li>';
//        }
//    }
//    if (html != "")
//        $$(".popup-filebrowser #list-element").html(html);
//    else
//        $$(".popup-filebrowser #list-element").html("No elements!");
//}
//
//function onFailCallback(e) {
//    alert(error.e)
//}
//
//function getFilepath(thefilepath) {
//    alert(thefilepath);
//}


