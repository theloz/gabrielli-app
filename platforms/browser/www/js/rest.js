function loadTweets() {
    var request = new XMLHttpRequest();
    request.open("GET", "http://search.twitter.com/search.json?q=phonegap", true);
    request.onreadystatechange = function() {//Call a function when the state changes.
        if (request.readyState == 4) {
            if (request.status == 200 || request.status == 0) {
                var tweets = JSON.parse(request.responseText);
                var data = "<table cellspacing='0'>";
                var tableClass;
                for (i = 0; i < tweets.results.length; i++) {
                    if (i % 2 == 0) {
                        tableClass = 'tweetOdd';
                    }
                    else {
                        tableClass = 'tweetEven';
                    }
                    data += "<tr style='border: 1px solid black'>";
                    data += "<td class='" + tableClass + "'>";
                    data += "<img src='" + tweets.results[i].profile_image_url + "'/>";
                    data += "</td>";
                    data += "<td class='" + tableClass + "'>";
                    data += "<b>" + tweets.results[i].from_user + "</b><br/>";
                    data += tweets.results[i].text + "<br/>";
                    data += tweets.results[i].created_at;
                    data += "</td>";
                    data += "</tr>";
                }
                data += "</table>";
                var twitter = document.getElementById("latestTweets");
                twitter.innerHTML = data;
            }
        }
    }
    console.log("asking for tweets");
    request.send();
}


