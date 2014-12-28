var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/floating-test.html',
    test    =   require('./lib/harness.js');
    gotIt   =   false;

test.name('floating test');
test.expect(11);

page.viewportSize = {
  width: 320,
  height: 480
};

page.open(url);

page.onResourceReceived = function(response) {

    if(!gotIt && response.url.match(/http\:\/\/my\.mobfox\.com\/request\.php/)){

        gotIt = true;

        page.injectJs("js/simulate.js");


        setTimeout(function(){

            var container = page.evaluate(function(){
                var container = document.querySelector("#mobfox_floating");

                return {
                    style: {
                        left    : container.style.left,
                        bottom : container.style.bottom
                    },
                    innerWidth : container.innerWidth
                };
            });

            test.equal(container.style.left,"10px");
            test.equal(container.style.bottom,"0px");

            var ad = page.evaluate(function() {

                var container = document.querySelector("#mobfox_floating"),
                    ad = container.contentWindow.document.querySelector(".mobfox_iframe");

                return {
                    id : ad.id,
                    width : ad.width,
                    height : ad.height
                };
            });

            var button = page.evaluate(function() {
                var container = document.querySelector("#mobfox_floating");
                    button = container.contentWindow.document.querySelector("#mobfox_dismiss");

                return {
                    width : button.width,
                    height : button.height,
                    style  : {
                        width   : button.style.width,
                        height  : button.style.height
                    },
                    tag    : button.tagName
                };

            });

            test.ok(ad.id.match(/^mobfox_\d+$/));
            test.equal(ad.width,"300");
            test.equal(ad.height,"50");


            test.equal(button.width,"40");
            test.equal(button.height,"40");
            test.equal(button.style.width,"20px");
            test.equal(button.style.height,"20px");

            test.equal(button.tag.toLowerCase(),"canvas");

            page.evaluate(function() {
                simulate(document.querySelector("#mobfox_floating").contentWindow.document.querySelector("#mobfox_dismiss"), "click");
            });

            container = page.evaluate(function(){
                return document.querySelector("#mobfox_floating");
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
