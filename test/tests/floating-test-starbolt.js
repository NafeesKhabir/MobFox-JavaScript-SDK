var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/floating-test-starbolt.html',
    test    =   require('./lib/harness.js');

test.name('floating test starbolt');
test.expect(4);

page.open(url);

var received = false;
page.onResourceReceived = function(response) {

    if(response.url.match(/\/js\/response\-banner\-starbolt\.js/) && !received){
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

            page.includeJs('https://code.jquery.com/jquery-2.1.3.min.js', function() {
                var offset = page.evaluate(function(){

                    var container   = document.querySelector("#mobfox_floating");
                        return $(container).offset();
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

page.onError = function(msg, trace) {

  var msgStack = ['ERROR: ' + msg];

  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
    });
  }

  console.error(msgStack.join('\n'));

};
/*page.onResourceRequested = function(requestData, networkRequest) {
  console.log('^ '+requestData.url);
};

page.onResourceReceived = function(response) {
  console.log("> "+response.url);
};*/
