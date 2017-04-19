// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
});


// Now we need to run the code that will be executed only for About page.

//myApp.onPageBeforeInit('rest', function (page) {
//  $$.get("http://www.google.com", function(data){
//        //if (data == 'success') {
//        var pippo=1;
//        //alert(data);
//        
//        if (pippo == 0) {
//            myApp.showToolbar('.tabbar');
//            myApp.showNavbar('.navbar');
//            console.log('it works');
//            mainView.router.loadPage('rest.html');
//        }
//        else {
//            /*
//            console.log(data);
//            console.log('trigged route to login')
//            myApp.hideToolbar('.tabbar');
//            myApp.hideNavbar('.navbar');
//            mainView.router.loadPage('login.html');
//          */
//            myApp.alert('booo!');
//            //mainView.router.loadPage('{login.html}');
//            mainView.router.load({url:'login.html'});
//            myApp.alert('ya!!');
//
//
//        }
//    });
//}).trigger();
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

})
// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;
    var mainView = myApp.addView(".view-main");


    $$("#btn-logout").click(function () {
        window.sessionStorage.clear();
        mainView.router.loadPage("login.html");
        console.log("Distroy all!!!");
    });
    //Pagina di Login
    if (page.name === 'login') {
        //Press Login button
        $$("#btn-login").click(function () {
            //Get Form Login
            var formLogin = myApp.formGetData('frm-login');
            //If user match
            if (formLogin.username === "asd") {
                //Set user in session
                window.sessionStorage.setItem("username", formLogin.username);
                //Set token auth
                window.sessionStorage.setItem("authorized", 1);
                //Authorized
                mainView.router.loadPage("index.html");

                console.log("Welcome!");
            } else {
                //not Authorized and must login
                mainView.router.loadPage("login.html");

                console.log("Try again!!");
            }
        });
        // Following code will be executed for page with data-page attribute equal to "about"
        //myApp.alert('Here comes About page');
//        myApp.showPreloader();
    } else {
        //Check if user is logged in retrieving user from session 
        if (window.sessionStorage.authorized != 1) {
            mainView.router.loadPage("login.html");
            console.log("Not logged in!!");
        } else {

            console.log("Logged in!!");
        }
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
//$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
//    // Following code will be executed for page with data-page attribute equal to "about"
//    //myApp.alert('Here comes About page');
//})

