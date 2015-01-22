var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/inter-static-starbolt.html',
    test    =   require('./lib/harness.js');
    gotIt   =   false;

test.name('interstitial test static click starbolt');
test.expect(7);

page.open(url);

page.onResourceReceived = function(response) {

    if(!gotIt && response.url.match(/\/js\/response\-banner\-starbolt\.js/)){

        gotIt = true;

        page.injectJs("js/simulate.js");

        setTimeout(function(){

            var ad = page.evaluate(function() {

                var container = document.querySelector("#mobfox_interstitial"),
                    ad = container.contentWindow.document.querySelector(".mobfox_iframe");

                return {
                    id : ad.id,
                    width : ad.width,
                    height : ad.height
                };
            });

            var button = page.evaluate(function() {
                var container = document.querySelector("#mobfox_interstitial");
                    button = container.contentWindow.document.querySelector("#mobfox_dismiss");

                return {
                    width : button.width,
                    height : button.height,
                    tag    : button.tagName
                };

            });

            test.ok(ad.id.match(/^mobfox_test$/));
            test.equal(ad.width,"320");
            test.equal(ad.height,"50");


            test.equal(button.width,"40");
            test.equal(button.height,"40");
            test.equal(button.tag.toLowerCase(),"canvas");

            page.includeJs('https://code.jquery.com/jquery-2.1.3.min.js', function() {
                var offset = page.evaluate(function(){
                    var iframe = document.querySelector("#mobfox_interstitial"); 
                    return $(iframe).offset();
                });
                page.sendEvent('click',offset.left,offset.top );
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
