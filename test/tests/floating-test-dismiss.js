var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/floating-test.html',
    test    =   require('./lib/harness.js');

test.name('floating test - dismiss button');
test.expect(4);

page.open(url);

var received = false;
page.onResourceReceived = function(response) {

    if(response.url.match(/\/js\/response\-banner\.js/) && !received){
        received = true;

        page.injectJs("js/simulate.js");

        setTimeout(function(){

            var id = page.evaluate(function() {
                var container   = document.querySelector("#mobfox_floating"),
                    ad          = document.querySelector(".mobfox_iframe");
                return ad.id;
            });

            var width = page.evaluate(function() {
                var container   = document.querySelector("#mobfox_floating"),
                    ad          = document.querySelector(".mobfox_iframe");
                return ad.width;
            });

            var height = page.evaluate(function() {
                var container   = document.querySelector("#mobfox_floating"),
                    ad          = document.querySelector(".mobfox_iframe");
                return ad.height;
            });

            test.ok(id.match(/^mobfox_test$/));
            test.equal(width,"320");
            test.equal(height,"50");

            page.evaluate(function() {
                simulate(document.querySelector("#mobfox_dismiss"), "click");
            });

            page.includeJs('https://code.jquery.com/jquery-2.1.3.min.js', function() {
                var offset = page.evaluate(function(){
                    var dismiss = document.querySelector("#mobfox_dismiss");
                    return $(dismiss).offset();
                });
                page.sendEvent('click',offset.left,offset.top );
            });
            
            var container = page.evaluate(function(){
                return document.querySelector("#mobfox_floating");
            });

            



            test.ok(!container);
            test.done();

        },100);
    }
};
