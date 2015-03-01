var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/passback-tag-multi.html',
    test    =   require('./lib/harness.js');

test.name('passback tag multi');
test.expect(3);

page.open(url, function (status) {
});

var adCalls = 0,adReqs  = {},done=false;

page.onResourceReceived = function(resp) {
    if(resp.url.match(/http:\/\/my\.mobfox\.com\/request\.php/)){

        if(!adReqs[resp.url]){
            adReqs[resp.url] = true;
            adCalls++;
        }

        if(!done && adCalls === 2){
            done = true;
            setTimeout(function(){
                var iframeCount = page.evaluate(function(){
                    return document.querySelectorAll("iframe").length;
                });

                var textFirst = page.evaluate(function(){
                    return document.querySelector("#first iframe").contentWindow.document.querySelector("h1").textContent.trim();
                });

                var textSecond = page.evaluate(function(){
                    return document.querySelector("#second iframe").contentWindow.document.querySelector("h1").textContent.trim();
                });
                test.equal(iframeCount,2);
                test.equal(textFirst,"Hello");
                test.equal(textSecond,"Goodbye");
                test.done();
            },100);
        }
    }
};

