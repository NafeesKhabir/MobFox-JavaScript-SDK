var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/floating-test.html',
    test    =   require('./lib/harness.js');

test.name('floating test');
test.expect(4);

page.open(url);

var received = false;
page.onResourceReceived = function(response) {

    if(response.url.match(/\/js\/response\-banner\.js/) && !received){
        received = true;
        setTimeout(function(){

            var id = page.evaluate(function() {
                var container   = document.querySelector("#mobfox_floating"),
                    ad          = container.contentWindow.document.querySelector(".mobfox_iframe");
                return ad.id;
            });

            var width = page.evaluate(function() {
                var container   = document.querySelector("#mobfox_floating"),
                    ad          = container.contentWindow.document.querySelector(".mobfox_iframe");
                return ad.width;
            });

            var height = page.evaluate(function() {
                var container   = document.querySelector("#mobfox_floating"),
                    ad          = container.contentWindow.document.querySelector(".mobfox_iframe");
                return ad.height;
            });

            test.ok(id.match(/^mobfox_test$/));
            test.equal(width,"320");
            test.equal(height,"50");

            page.evaluate(function(){
                var evt = document.createEvent("MouseEvents");
                evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                var container   = document.querySelector("#mobfox_floating"),
                    ad          = container.contentWindow.document.querySelector(".mobfox_iframe");
                ad.dispatchEvent(evt);
            });

        },100);
    }
};

page.onNavigationRequested = function(url, type, willNavigate, main) {

  if(url==="http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f"){
    test.equal(url,"http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f","Navigate to landing page.");
    test.done();
  }
};
/*page.onResourceRequested = function(requestData, networkRequest) {
  console.log('^ '+requestData.url);
};

page.onResourceReceived = function(response) {
  console.log("> "+response.url);
};*/
