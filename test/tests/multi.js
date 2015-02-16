var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/multi.html',
    test    =   require('./lib/harness.js');

test.name('multi');
test.expect(3);

page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log('CONSOLE: ' + msg);
};

page.open(url,function(){

    page.evaluate(function(){
        
        console.log("defined");

    });
});


var receivedFirst = false,
    receivedSecond = false;

page.onResourceReceived = function(response) {

    if(response.url.match(/\/js\/300x250_second\.js/)){
        receivedFirst = true;
    }

    if(response.url.match(/\/js\/response\-banner\.js/)){
        receivedSecond = true;
    }

    if(receivedFirst && receivedSecond){
        setTimeout(function(){

            var ids = page.evaluate(function() {
                return Array.prototype.map.call( document.querySelectorAll(".mobfox_iframe"), function(e) {
                    return e.id;
                });
            });


            /*var width = page.evaluate(function() {
                return document.querySelector(".mobfox_iframe").width;
            });

            var height = page.evaluate(function() {
                return document.querySelector(".mobfox_iframe").height;
            });

            var beforeMobfoxConfig = page.evaluate(function(){
                return document.querySelector(".mobfox_iframe").parentNode.nextSibling.id === "mobfoxConfig" ;
            });*/


            test.equal(ids.length,2);
            ids.forEach(function(id){
                test.ok(id.match(/^mobfox_test/));
            });
            /*test.equal(width,"320");
            test.equal(height,"50");
            test.ok(beforeMobfoxConfig);*/

            /*page.includeJs('https://code.jquery.com/jquery-2.1.3.min.js', function() {
                var offset = page.evaluate(function(){
                    var iframe = document.querySelector(".mobfox_iframe"); 
                    return $(iframe).offset();
                });
                page.sendEvent('click',offset.left,offset.top );
            });*/

            test.done();

        },100);
    }
};

/*page.onNavigationRequested = function(url, type, willNavigate, main) {

  if(url==="http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f"){
    test.equal(url,"http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f","Navigate to landing page.");
    test.done();
  }
};*/
/*page.onResourceRequested = function(requestData, networkRequest) {
  console.log('^ '+requestData.url);
};

page.onResourceReceived = function(response) {
  console.log("> "+response.url);
};*/
