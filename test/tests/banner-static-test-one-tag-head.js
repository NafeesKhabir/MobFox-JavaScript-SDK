var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/banner-static-one-tag-head.html',
    test    =   require('./lib/harness.js');

test.name('banner static test one tag head');
test.expect(6);

page.open(url);

var received = false;
page.onResourceReceived = function(response) {

    if(response.url.match(/\/js\/response\-banner\.js/) && !received){
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

            var adParentTag = page.evaluate(function(){
                return document.querySelector(".mobfox_iframe").parentNode.parentNode.tagName;
            });

            var adNextSibling = page.evaluate(function(){
                return document.querySelector(".mobfox_iframe").parentNode.nextElementSibling;
            });

            test.ok(id.match(/^mobfox_test$/));
            test.equal(width,"320");
            test.equal(height,"50");
            test.equal(adParentTag.toLowerCase(),"body");
            test.ok(!adNextSibling);

            page.includeJs('https://code.jquery.com/jquery-2.1.3.min.js', function() {
                var offset = page.evaluate(function(){
                    var iframe = document.querySelector(".mobfox_iframe"); 
                    return $(iframe).offset();
                });
                page.sendEvent('click',offset.left+5,offset.top +5);
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
