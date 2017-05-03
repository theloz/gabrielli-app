// Initialize app
var myApp = new Framework7({
    template7Pages: true,
});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

$$.ajaxSetup({headers: {'Access-Control-Allow-Origin': '*'}});

// Add view
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
});

//Configuration for Infinite Scrolling
var loading = false;
var lastIndex;
// Max items to load 
var maxItems = 50;
// Append items per load
var itemsPerLoad = 10;

/*-----------------
 Every pages
 -----------------*/
//Before Init

myApp.onPageBeforeInit('*', function (page) {
    //Check if user is logged in retrieving user from session 
    if (window.sessionStorage.authorized === "") {
        //mainView.router.loadPage("login.html");
        myApp.loginScreen(".login-screen", false);
    } else {
        myApp.closeModal(".login-screen", false);
    }
});

//Init for every page
myApp.onPageInit("*", function () {

});

/*-----------------
 Single pages
 -----------------*/
//Index
myApp.onPageInit('index', function () {
    $$("#box-welcome").html("Benvenuto " + window.sessionStorage.username);
    $$("#btn-logout").click(function () {
        window.sessionStorage.clear();
        myApp.loginScreen(".login-screen", false);
    });
    //Login Button
    $$("#btn-login").click(function () {
        var formLogin = myApp.formGetData('frm-login');
        //Get Form Login
        if (formLogin.username === "asd") {
            window.sessionStorage.setItem("username", formLogin.username);  //Set user in session
            window.sessionStorage.setItem("authorized", 1);                 //Set token auth
            myApp.closeModal(".login-screen", false);                              //Close login screen
        }
    });
    $$("#btn-test").click(function () {
        $$.ajax({
            headers: {
                'Authorization': 'Bearer 102-token',
                'Access-Control-Allow-Origin': '*',
                'Content-type': 'multipart/form-data',
                'dataType':'json',
            },
            url: 'http://192.168.3.9/v2/ttm/list',
            method: 'GET',
            crossDomain: true,
//            error: function (data, status, xhr) {
//                alert(JSON.stringify(data));
//            },
            success: function (data, status, xhr) {
                alert("success");
            },
            statusCode: {
                401: function (xhr) {
                    alert('Non autorizzato');
                }
            }
        });
//        $$.getJSON('http://192.168.3.9/v2/ttm/list', function (data) {
//            console.log("in function");
//            console.log(JSON.stringify(data));
//        });
    });
}).trigger();

//Manage Ticket
var manage_ticket = myApp.onPageInit('manage_ticket', function (page) {
//    $$('.page-content').on('scroll', function () {
//        console.log("scroll  "+$$(this).scrollTop()+" + h "+$$(this).height()+" + tableH "+$$(".data-table").height());
//        if ($$(this).scrollTop() + $$(this).height() >= $$(".data-table").height()) {
//            $$(".speed-dial").css("top","70px");
//            $$(".speed-dial-buttons").css("bottom","5%");
//        }else{
//            $$(".speed-dial").css("top", "initial");
//            $$(".speed-dial-buttons").css("bottom","100%");
//            
//        }
//    });

    //Pull to refresh
    var ptrContent = $$('.pull-to-refresh-content');
// Add 'refresh' listener on it
    ptrContent.on('ptr:refresh', function (e) {
        // Emulate 2s loading
        setTimeout(function () {
            // When loading done, we need to reset it
            myApp.pullToRefreshDone();
            manage_ticket.trigger();
        }, 1000);
    });

//    $$.getJSON('http://192.168.3.9/v1/ttm/list', function (json) {
//        //Table Construction
//        buildHtmlTable(json);
//    });
//    var myList = [];
//    for (var i = 1; i <= itemsPerLoad; i++) {
//        myList.push({"id": i, "titolo": "Ticket " + i});
//    }
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
//            var newList = [];
//            for (var i = lastIndex; i < lastIndex + itemsPerLoad; i++) {
//                newList.push({"id": i, "titolo": "Ticket " + i});
//            }
            var newList;
            newList = getTktDataByFilter(lastIndex, itemsPerLoad, filter, sort);
            buildHtmlTableBody(newList, ["id", "titolo", "descrizione", "stato", "utente","fornitore","dttm"]);
            lastIndex = lastIndex + itemsPerLoad;
        }, 500);
    });


    $$(".ticket-info").click(function () {
    });
});

//TicketPage 
myApp.onPageInit('ticketPage', function (page) {
    var ticketId = page.query.id;
    $$.getJSON('http://192.168.3.9/v1/ttm/oneticket?id=' + ticketId + '', function (json) {
        $$("#testRest").html(JSON.stringify(json));
    });
});
