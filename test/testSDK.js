var static = require('node-static');

var fileServer = new static.Server('./test/www'),
    server,
    phantom,
    page;

//-----------------------------------------
module.exports.setUp = function (cb) {
    server = require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            fileServer.serve(request, response);
        }).resume();
    });
    server.listen(58080,function(){
    
        require('phantom').create().then(function(ph) {
            phantom = ph;
            ph.createPage().then(function(_page) {
                page = _page;
                cb();
            });
        }); 
    
    });
};
//-----------------------------------------
module.exports.tearDown = function (cb) {
    phantom.exit();
    server.close(cb);
};
//-----------------------------------------
module.exports.testBanner = function(test){

    test.expect(4);
    var loaded = false,data;

    page.on('onLoadFinished', function(status) {
        if(loaded) return;
        if(status === "success") loaded = true;

        page.evaluate(function() {
            var iframe = document.querySelector(".mobfox_iframe");
            return {
                id:iframe.id,
                width:iframe.width,
                height:iframe.height,
                beforeMobfoxConfig : document.querySelector(".mobfox_iframe").parentNode.nextSibling.id === "mobfoxConfig"
            };

        }).then(function(_data){
            data = _data;
            test.ok(data.id.match(/^mobfox_\d+$/));
            test.equal(data.width,"320");
            test.equal(data.height,"50");
            test.ok(data.beforeMobfoxConfig);
            test.done();
        });
    });

    page.open('http://localhost:58080/banner-test.html');
};
//-----------------------------------------
module.exports.testBannerJQuery = function (test) {

    test.expect(4);
    var loaded = false,
        data;

    page.on('onLoadFinished', function(status) {
        if(loaded) return;
        if(status === "success") loaded = true;

        page.evaluate(function() {
            var iframe = document.querySelector(".mobfox_iframe");
            return {
                id:iframe.id,
                width:iframe.width,
                height:iframe.height,
                offset : $(iframe).offset()
            };

        }).then(function(_data){
            data = _data;
            test.ok(data.id.match(/^mobfox_test$/));
            test.equal(data.width,"320");
            test.equal(data.height,"480");
        });
    });

    page.on('onNavigationRequested',function(url, type, willNavigate, main) {
      //ad clicked, finish test
      if(url==="http://my.mobfox.com/exchange.click.php?h=03838a2444c29c7d8f109a5092be8a5b"){
        test.equal(url,"http://my.mobfox.com/exchange.click.php?h=03838a2444c29c7d8f109a5092be8a5b","Navigate to landing page.");
        test.done();
      }
    });

    page.on('onResourceRequested',function(requestData, networkRequest) {
        //impression, ad shown
        if(requestData.url==="http://my.mobfox.com/exchange.pixel.php?h=03838a2444c29c7d8f109a5092be8a5b"){
            page.sendEvent('click',data.offset.left+5,data.offset.top +5);
        }
    });

    page.open('http://localhost:58080/banner-jquery.html');

};
//-----------------------------------------
module.exports.testBannerStatic = function (test) {

    test.expect(5);
    var loaded = false,
        data;

    page.on('onLoadFinished', function(status) {
        if(loaded) return;
        if(status === "success") loaded = true;

        page.evaluate(function() {
            var iframe = document.querySelector(".mobfox_iframe");
            return {
                id:iframe.id,
                srcdoc : iframe.srcdoc,
                width:iframe.width,
                height:iframe.height,
                beforeMobfoxConfig : document.querySelector(".mobfox_iframe").parentNode.nextSibling.id === "mobfoxConfig",
                offset : $(iframe).offset()
            };

        }).then(function(_data){
            data = _data;
            test.ok(data.id.match(/^mobfox_test$/));
            test.equal(data.width,"320");
            test.equal(data.height,"50");
            test.ok(data.beforeMobfoxConfig);

        });
    });

    page.on('onNavigationRequested',function(url, type, willNavigate, main) {
        //ad clicked, finish test
        if(url==="http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f"){
            test.equal(url,"http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f","Navigate to landing page.");
            test.done();
        }
    });

    page.on('onResourceRequested',function(requestData, networkRequest) {
        //impression, ad shown
        if(requestData.url==="http://my.mobfox.com/exchange.pixel.php?h=c9400133ac5b182d10a130c99bf9035f"){
            page.sendEvent('click',data.offset.left+5,data.offset.top +5);
        }
    });

    page.open('http://localhost:58080/banner-static.html');

};
//-----------------------------------------
