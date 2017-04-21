// Initialize app
var myApp = new Framework7({
    template7Pages: true,
});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true,
});

//Preload landing page : home.html
mainView.router.load({
    url: 'home.html',
    context: {
        username: window.sessionStorage.username,
    }
});
$$.ajaxSetup({
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
})

/*-----------------
 Every pages
 -----------------*/
//Before Init
myApp.onPageBeforeInit('*', function (page) {
    console.log("page: "+page.name);
    //Check if user is logged in retrieving user from session 
    if (window.sessionStorage.authorized != 1) {
        //mainView.router.loadPage("login.html");
        myApp.loginScreen(".login-screen", false);
    } else {
        myApp.closeModal(".login-screen", false);
    }
});

$$("#btn-logout").click(function () {
    console.log("logout");
    window.sessionStorage.clear();
    myApp.loginScreen(".login-screen", false);
    console.log("logout2");
});

//Login Button
$$("#btn-login").click(function () {
    //Get Form Login
    var formLogin = myApp.formGetData('frm-login');
    if (formLogin.username === "asd") {
        window.sessionStorage.setItem("username", formLogin.username);  //Set user in session
        window.sessionStorage.setItem("authorized", 1);                 //Set token auth
        myApp.closeModal(".login-screen", false);                              //Close login screen
    }
});
/*-----------------
 Single pages
 -----------------*/

//Data Table
myApp.onPageInit('dataTable', function (page) {
    $$.getJSON('http://gabrielli-test.afbnet.it/v1/ttm/list', function (json) {
        buildHtmlTable(json);
    });
//    $$.getJSON('http://gabrielli-test.afbnet.it/v1/ttm/list', function (json) {
//        buildHtmlTable(json);
//    });
//    var myList = [{"name": "elia", "age": 50, "hobby": "tennis"},{"name": "tobia", "age": "25", "hobby": "swimming"},{"name": "ciaone","age": 10, "hobby": "programming"}];
//   buildHtmlTable(myList);

});

//TicketPage 
myApp.onPageInit('ticketPage', function (page) {
    var ticketId = page.query.id;
    $$.getJSON('http://gabrielli-test.afbnet.it/v1/ttm/oneticket?id='+ticketId+'', function (json) {
        $$("#testRest").html(JSON.stringify(json));
    });



});

function buildHtmlTable(myList) {
    var columns = addAllColumnHeaders(myList);

    for (var i = 0; i < myList.length; i++) {
//        var link$ = $$('<a href="home.html?id='+ myList[i][columns[0]] +'"/>');
        var row$ = $$('<tr/>');
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var cellValue = myList[i][columns[colIndex]];

            if (cellValue === null) {
                cellValue = "";
            }
            //row$.append(link$);
            row$.append($$('<td data-collapsible-title="'+[columns[colIndex]]+'"/>').html('<a href="ticketPage.html?id='+ myList[i][columns[0]] +'">' + cellValue + '</a>'));
        }
        //var def$ = link$.append(row$);
        $$(".data-table > table tbody").append(row$);
    }
}



function addAllColumnHeaders(myList)
{
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
// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('rest', function (page) {
    //myApp.alert("rest page here");
    /*$$.getJSON('http://ergast.com/api/f1/constructors/renault/constructorStandings/1/seasons.json', function (json) {
     //console.log(json);
     $$('#restcontainer').html(json);
     });*/
    //$$('#gg-title').hide();
//    $$.get('http://ergast.com/api/f1/constructors/renault/constructorStandings/1/seasons.json', {id: 3}, function (data) {
//        //console.log(data);
//        $$('#restcontainer').html(data);
//    });
});
