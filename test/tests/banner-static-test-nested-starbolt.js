var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/banner-static-nested-starbolt.html',
    test    =   require('./lib/harness.js');

test.name('banner static test nested head');
test.expect(3);

page.open(url);

var received = false;
page.onResourceReceived = function(response) {

    if(response.url.match(/\/js\/response\-banner\-starbolt\.js/) && !received){
        received = true;
        setTimeout(function(){

            var width = page.evaluate(function() {
                return document.querySelector("iframe").width;
            });

            var height = page.evaluate(function() {
                return document.querySelector("iframe").height;
            });


            test.equal(width,"320");
            test.equal(height,"50");

            page.includeJs('https://code.jquery.com/jquery-2.1.3.min.js', function() {
                var offset = page.evaluate(function(){
                    var iframe = document.querySelector("iframe"); 
                    return $(iframe).offset();
                });
                page.sendEvent('click',offset.left+5,offset.top+5 );
            });

        },100);
    }
};

page.onNavigationRequested = function(url, type, willNavigate, main) {

  if(url==="https://play.google.com/store/apps/details?id=com.topgames.FighterCowboy.en"){
    test.equal(url,"https://play.google.com/store/apps/details?id=com.topgames.FighterCowboy.en");
    test.done();
  }
};
/*page.onResourceRequested = function(requestData, networkRequest) {
  console.log('^ '+requestData.url);
};

page.onResourceReceived = function(response) {
  console.log("> "+response.url);
};*/
