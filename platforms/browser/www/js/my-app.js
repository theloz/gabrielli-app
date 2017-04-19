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
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
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
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page
    //myApp.alert('geeno');
    $$('#gg-title').hide();
})
myApp.onPageInit('login', function (page) {
    // Do something here for "about" page
    //myApp.alert('geeno');
    //$$('#gg-title').hide();
})
myApp.onPageInit('rest', function (page){
    //myApp.alert("rest page here");
    /*$$.getJSON('http://ergast.com/api/f1/constructors/renault/constructorStandings/1/seasons.json', function (json) {
        //console.log(json);
        $$('#restcontainer').html(json);
    });*/
    $$('#gg-title').hide();
    $$.get('http://ergast.com/api/f1/constructors/renault/constructorStandings/1/seasons.json', {id: 3}, function (data) {
        //console.log(data);
        $$('#restcontainer').html(data);
    });

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        //myApp.alert('Here comes About page');
        myApp.showPreloader();
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    //myApp.alert('Here comes About page');
})

