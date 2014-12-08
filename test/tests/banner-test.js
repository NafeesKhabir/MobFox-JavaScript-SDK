var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/banner-test.html',
    test    =   require('./lib/harness.js');

test.name('banner test callback');
test.expect(4);

page.open(url);

page.onResourceReceived = function(response) {
    if(response.url.match(/http\:\/\/my\.mobfox\.com\/request\.php/)){
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
                return document.querySelector(".mobfox_iframe").nextSibling.id === "mobfoxConfig" ;
            });
            test.ok(id.match(/^mobfox_\d+$/));
            test.equal(width,"320");
            test.equal(height,"50");
            test.ok(beforeMobfoxConfig);
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
