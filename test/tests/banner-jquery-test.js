var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/banner-jquery.html',
    test    =   require('./lib/harness.js');

test.name('banner jquery test');
test.expect(5);

page.open(url);

var received = false;
page.onResourceReceived = function(response) {

    if(response.url.match(/\/js\/response\-inter\.js/) && !received){
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


            test.ok(response.url.match(/adspace_width=320/));
            test.ok(id.match(/^mobfox_test$/));
            test.equal(width,"320");
            test.equal(height,"480");

            setTimeout(function(){
                var offset = page.evaluate(function(){
                    var iframe = document.querySelector(".mobfox_iframe"); 
                    return $(iframe).offset();
                });
                page.sendEvent('click',offset.left+5,offset.top +5);
            },500);

        },100);
    }
};

page.onNavigationRequested = function(url, type, willNavigate, main) {

  if(url==="http://my.mobfox.com/exchange.click.php?h=03838a2444c29c7d8f109a5092be8a5b"){
    test.equal(url,"http://my.mobfox.com/exchange.click.php?h=03838a2444c29c7d8f109a5092be8a5b","Navigate to landing page.");
    test.done();
  }
};
/*page.onResourceRequested = function(requestData, networkRequest) {
  console.log('^ '+requestData.url);
};

page.onResourceReceived = function(response) {
  console.log("> "+response.url);
};*/
