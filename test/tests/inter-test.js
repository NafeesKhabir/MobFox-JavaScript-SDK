var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/inter-test.html',
    test    =   require('./lib/harness.js');
    gotIt   =   false;

test.name('interstitial test callback');
test.expect(7);

page.open(url);

page.onResourceReceived = function(response) {

    if(!gotIt && response.url.match(/http\:\/\/my\.mobfox\.com\/request\.php/)){

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

            test.ok(ad.id.match(/^mobfox_\d+$/));
            test.equal(ad.width,"320");
            test.equal(ad.height,"480");


            test.equal(button.width,"40");
            test.equal(button.height,"40");
            test.equal(button.tag.toLowerCase(),"canvas");

            page.evaluate(function() {
                simulate(document.querySelector("#mobfox_interstitial").contentWindow.document.querySelector("#mobfox_dismiss"), "click");
            });
            var container = page.evaluate(function(){
                return document.querySelector("#mobfox_interstitial");
            });
            test.ok(!container);
            test.done();

        },100);
    }
};

/*page.onResourceRequested = function(requestData, networkRequest) {
  console.log('^ '+requestData.url);
};

page.onResourceReceived = function(response) {
  console.log("> "+response.url);
};*/
