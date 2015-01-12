var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/banner-static-starbolt.html',
    test    =   require('./lib/harness.js');

test.name('banner static test + starbolt ad');
test.expect(5);

page.open(url);

var received = false;
page.onResourceReceived = function(response) {

    if(response.url.match(/\/js\/response\-banner\-starbolt\.js/) && !received){
        received = true;
        setTimeout(function(){

            var id = page.evaluate(function() {
                return document.querySelector(".mobfox_iframe").id;
            });

            var width = page.evaluate(function() {
                return document.querySelector(".mobfox_iframe").width;
            });

            var height = page.evaluate(function() {
                return document.querySelector(".mobfox_iframe").height;
            });

            var beforeMobfoxConfig = page.evaluate(function(){
                return document.querySelector(".mobfox_iframe").parentNode.nextSibling.id === "mobfoxConfig" ;
            });

            test.ok(id.match(/^mobfox_test$/));
            test.equal(width,"320");
            test.equal(height,"50");
            test.ok(beforeMobfoxConfig);
    
            page.evaluate(function(){
                var evt = document.createEvent("MouseEvents");
                evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                var a = document.querySelector(".mobfox_iframe"); 
                a.dispatchEvent(evt);
            });

        },100);
    }
};

page.onNavigationRequested = function(url, type, willNavigate, main) {

  var landingPage = "https://play.google.com/store/apps/details?id=com.topgames.FighterCowboy.en";
  if(url===landingPage){
    test.equal(url,landingPage);
    test.done();
  }
};
/*page.onResourceRequested = function(requestData, networkRequest) {
  console.log('^ '+requestData.url);
};

page.onResourceReceived = function(response) {
  console.log("> "+response.url);
};*/
