var static  = require('node-static');
var URL     = require('url');

var fileServer = new static.Server('./test/www'),
    server,
    phantom,
    page;

var domain      = 'http://my.mobfox.com/request.php';
var clickUrl    = 'http://tokyo-my.mobfox.com/exchange.click.php';

var self = this;

//-----------------------------------------

function standardPageTest(test, pageURL, clickURL) {
    console.log('standardPageTest');
    
    test.expect(3);
    
    var loaded = false,
        data;

    page.on('onNavigationRequested',function(url, type, willNavigate, main) {
        console.log('onNavigationRequested');
        
        //ad clicked, finish test
        if (url.startsWith(clickUrl)) {
            test.ok(URL.parse(url).query.startsWith("h="));
            test.done();
        }

    });
    
    page.on('onConsoleMessage', function(msg) {
        console.log('onConsoleMessage');
    
        if (msg != 'onSuccess')     return;
        
        if (loaded)                 return;
        if (msg === "onSuccess")    loaded = true;
        
        page.includeJs('https://code.jquery.com/jquery-2.1.3.min.js').then(function() {
            console.log('includeJs');
            
            page.evaluate(function() {
                console.log('evaluate');

                var iframe = document.querySelector('iframe');

                return {
                    width   : $(iframe).width(),
                    height  : $(iframe).height(),
                    offset  : $(iframe).offset()
                };

            }).then(function(_data) {
                
                data = _data;
                test.equal(data.width   , "320");
                test.equal(data.height  , "50");
                
                page.sendEvent('click', data.offset.left + 5, data.offset.top + 5);
            });

        });
    });
    
//    page.on('onResourceReceived',function(response){
//        console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + JSON.stringify(response));
//    });
//    page.on('onResourceRequested', true, function(requestData, networkRequest) {
//            networkRequest.abort();
//            networkRequest.changeUrl(url); 
//        }
//    });
    
    page.open(pageURL);
}

//-----------------------------------------

function testSecure(test, pageURL) {
    test.expect(1);
    
    var loaded = false,
        data;
    
    page.on('onResourceRequested', function(requestData, networkRequest) {
//        https://my.mobfox.com/request.php
        if (requestData.url.startsWith("https")) {
//            console.log('done');
            test.ok(requestData.url.indexOf('my.mobfox.com') > -1);
            test.done();
        }
    });
    
    page.open(pageURL);
}

//-----------------------------------------

function testSmart(test, pageURL) {
    console.log('testSmart');
    
    test.expect(3);
    
    var loaded = false,
        data;

    page.on('onNavigationRequested',function(url, type, willNavigate, main) {
        console.log('onNavigationRequested, url ' + url);
        
        //ad clicked, finish test
        if (url.startsWith(clickUrl)) {
            test.ok(URL.parse(url).query.startsWith("h="));
            test.done();
        }

    });
    
    page.on('onConsoleMessage', function(msg) {
        console.log(msg);
    
        if (msg != 'success')     return;
        
        if (loaded)                 return;
        if (msg === "success")    loaded = true;
        
        page.includeJs('https://code.jquery.com/jquery-2.1.3.min.js').then(function() {
            console.log('includeJs');
            
            page.evaluate(function() {
                console.log('evaluate');

                var iframe = document.querySelector('iframe');
                
                return {
                    width   : $(iframe).width(),
                    height  : $(iframe).height(),
                    offset  : $(iframe).offset()
                };

            }).then(function(_data) {
//                console.log(_data);
                data = _data;
                test.equal(data.width   , 350);
                test.equal(data.height  , 300);
                
                console.log('click');
                page.sendEvent('click', data.offset.left + 100, data.offset.top + 100);
            });

        });
    });
    
//    page.on('onResourceReceived',function(response){
//        console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + JSON.stringify(response));
//    });
//    page.on('onResourceRequested', true, function(requestData, networkRequest) {
//            networkRequest.abort();
//            networkRequest.changeUrl(url); 
//        }
//    });
    
//    page.viewportSize = {width: 350, height: 350};
    page.property('viewportSize', {width: 350, height: 300}).then(function() {
        console.log('viewportSize');
        page.open(pageURL);
    });
    
//    page.open(pageURL);
}

//-----------------------------------------

function testVideoCollect(test, pageURL) {
    console.log('testVideoCollect');
    
    test.expect(2);
    
    var loaded = false;
    
    page.on('onConsoleMessage', function(msg) {
        console.log(msg);
    
        if (msg != 'ready') return;
        if (loaded) return;
        loaded = true;
        
        page.includeJs('https://code.jquery.com/jquery-2.1.3.min.js').then(function() {
            console.log('includeJs');
            
            var xml_arr = require('./res/xml_array.json');
            var callback = function(err, results) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(results);
                    console.log(test);
                }
            }
            page.evaluateAsync(function(xml_arr, cb) {
                console.log('evaluate');
                
                collect(xml_arr, function(err, vasts) {
                    if (err) {
//                        window.callPhantom(err);
                        console.log(err);
//                        cb(err);
                    } else {
//                        window.callPhantom(null, vasts);
                        console.log(vasts);
//                        cb(null, vasts);
                    }
                });
            }, 500, xml_arr, callback);
        });
    });
    
    page.property('onCallback', function(err, vasts) {
        if (err) {
            console.log(err);
        } else {
            console.log(vasts.arr.length == 3);
            
            test.ok(vasts.arr.length == 3);
            test.ok(vasts.errorTrackers.length == 0);
            return 'success';
        }
    });
    
    page.open(pageURL);
}
    
//-----------------------------------------

module.exports.setUp = function (cb) {
var request = require("request");
var url = "http://localhost:58080/index.html"
server = require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}).listen(58080, function() {
    console.log('listening..');
    request({
        url: url
    }, function (error, response, body) {
        console.log(response.statusCode);
        if (!error && response.statusCode === 200) {
            console.log(body) // Print the json response
        }
    });
    require('phantom').create().then(function(ph) {
        phantom = ph;
        ph.createPage().then(function(_page) {
            page = _page;
            page.setting('userAgent', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Mobile Safari/537.36');
//            page.set('viewportSize', {width: 320, height: 480});
            cb();
        });
    }); 
});
    
//    server = require('http').createServer(function (request, response) {
//        request.addListener('end', function () {
//            fileServer.serve(request, response);
//        }).resume();
//    });
//    
//    server.listen(58080,function(){
//    
//        console.log('listen');
//    
//        require('phantom').create().then(function(ph) {
//            phantom = ph;
//            ph.createPage().then(function(_page) {
//                page = _page;
//                page.setting('userAgent', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Mobile Safari/537.36');
//                cb();
//            });
//        }); 
//    
//    });
};
//-----------------------------------------
module.exports.tearDown = function (cb) {
//    phantom.exit();
//    server.close(cb);
    
    setTimeout(function() {
        phantom.exit();
        server.close(cb);
    }, 500);
};
//-----------------------------------------
//module.exports.testBanner = function(test){
//
//    test.expect(4);
//    var loaded = false,data;
//
//    page.on('onLoadFinished', function(status) {
//        if(loaded) return;
//        if(status === "success") loaded = true;
//
//        page.evaluate(function() {
//            var iframe = document.querySelector(".mobfox_iframe");
//            return {
//                id:iframe.id,
//                width:iframe.width,
//                height:iframe.height,
//                beforeMobfoxConfig : document.querySelector(".mobfox_iframe").parentNode.nextSibling.id === "mobfoxConfig"
//            };
//
//        }).then(function(_data){
//            data = _data;
//            test.ok(data.id.match(/^mobfox_\d+$/));
//            test.equal(data.width,"320");
//            test.equal(data.height,"50");
//            test.ok(data.beforeMobfoxConfig);
//            test.done();
//        });
//    });
//
//    page.open('http://localhost:58080/banner-test.html');
//};
////-----------------------------------------
//module.exports.testBannerJQuery = function (test) {
//
//    test.expect(4);
//    var loaded = false,
//        data;
//
//    page.on('onLoadFinished', function(status) {
//        if(loaded) return;
//        if(status === "success") loaded = true;
//
//        page.evaluate(function() {
//            var iframe = document.querySelector(".mobfox_iframe");
//            return {
//                id:iframe.id,
//                width:iframe.width,
//                height:iframe.height,
//                offset : $(iframe).offset()
//            };
//
//        }).then(function(_data){
//            data = _data;
//            test.ok(data.id.match(/^mobfox_test$/));
//            test.equal(data.width,"320");
//            test.equal(data.height,"480");
//        });
//    });
//
//    page.on('onNavigationRequested',function(url, type, willNavigate, main) {
//      //ad clicked, finish test
//      if(url==="http://my.mobfox.com/exchange.click.php?h=03838a2444c29c7d8f109a5092be8a5b"){
//        test.equal(url,"http://my.mobfox.com/exchange.click.php?h=03838a2444c29c7d8f109a5092be8a5b","Navigate to landing page.");
//        test.done();
//      }
//    });
//
//    page.on('onResourceRequested',function(requestData, networkRequest) {
//        //impression, ad shown
//        if(requestData.url==="http://my.mobfox.com/exchange.pixel.php?h=03838a2444c29c7d8f109a5092be8a5b"){
//            page.sendEvent('click',data.offset.left+5,data.offset.top +5);
//        }
//    });
//
//    page.open('http://localhost:58080/banner-jquery.html');
//
//};
////-----------------------------------------
//module.exports.testBannerStatic = function (test) {
//
//    test.expect(6);
//    var loaded = false,
//        data;
//
//    page.on('onLoadFinished', function(status) {
//        if(loaded) return;
//        if(status === "success") loaded = true;
//
//        page.evaluate(function() {
//            var iframe = document.querySelector(".mobfox_iframe");
//            return {
//                id:iframe.id,
//                srcdoc : iframe.srcdoc,
//                sandbox : iframe.sandbox,
//                width:iframe.width,
//                height:iframe.height,
//                beforeMobfoxConfig : document.querySelector(".mobfox_iframe").parentNode.nextSibling.id === "mobfoxConfig",
//                offset : $(iframe).offset()
//            };
//
//        }).then(function(_data){
//            data = _data;
//            test.ok(data.id.match(/^mobfox_test$/));
//            test.equal(data.sandbox,"allow-top-navigation allow-scripts allow-same-origin allow-popups");
//            test.equal(data.width,"320");
//            test.equal(data.height,"50");
//            test.ok(data.beforeMobfoxConfig);
//
//        });
//    });
//
//    page.on('onNavigationRequested',function(url, type, willNavigate, main) {
//        //ad clicked, finish test
//        if(url==="http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f"){
//            test.equal(url,"http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f","Navigate to landing page.");
//            test.done();
//        }
//    });
//
//    page.on('onResourceRequested',function(requestData, networkRequest) {
//        //impression, ad shown
//        if(requestData.url==="http://my.mobfox.com/exchange.pixel.php?h=c9400133ac5b182d10a130c99bf9035f"){
//            page.sendEvent('click',data.offset.left+5,data.offset.top +5);
//        }
//    });
//
//    page.open('http://localhost:58080/banner-static.html');
//
//};
////-----------------------------------------
//module.exports.testBannerDisableOrigin = function (test) {
//
//    test.expect(6);
//    var loaded = false,
//        data;
//
//    page.on('onLoadFinished', function(status) {
//        if(loaded) return;
//        if(status === "success") loaded = true;
//        page.evaluate(function() {
//            var iframe = document.querySelector(".mobfox_iframe");
//            return {
//                id:iframe.id,
//                srcdoc : iframe.srcdoc,
//                sandbox : iframe.sandbox,
//                width:iframe.width,
//                height:iframe.height,
//                beforeMobfoxConfig : document.querySelector(".mobfox_iframe").parentNode.nextSibling.id === "mobfoxConfig",
//                offset : $(iframe).offset()
//            };
//
//        }).then(function(_data){
//            data = _data;
//            test.ok(data.id.match(/^mobfox_test$/));
//            test.equal(data.sandbox,"allow-top-navigation allow-scripts allow-popups");
//            test.equal(data.width,"320");
//            test.equal(data.height,"50");
//            test.ok(data.beforeMobfoxConfig);
//
//        });
//    });
//
//    page.on('onNavigationRequested',function(url, type, willNavigate, main) {
//        //ad clicked, finish test
//        if(url==="http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f"){
//            test.equal(url,"http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f","Navigate to landing page.");
//            test.done();
//        }
//    });
//
//    page.on('onResourceRequested',function(requestData, networkRequest) {
//        //impression, ad shown
//        if(requestData.url==="http://my.mobfox.com/exchange.pixel.php?h=c9400133ac5b182d10a130c99bf9035f"){
//            page.sendEvent('click',data.offset.left+5,data.offset.top +5);
//        }
//    });
//
//    page.open('http://localhost:58080/banner-disable-origin.html');
//
//};

//-----------------------------------------
//module.exports.testBannerOneTag = function (test) {
//
//    test.expect(6);
//    var loaded = false,
//        data;
//
//    page.on('onLoadFinished', function(status) {
//        if(loaded) return;
//        if(status === "success") loaded = true;
//
//        page.includeJs('https://code.jquery.com/jquery-2.1.3.min.js').then(function(){
//            page.evaluate(function() {
//                var iframe = document.querySelector(".mobfox_iframe");
//                return {
//                    id:iframe.id,
//                    srcdoc : iframe.srcdoc,
//                    width:iframe.width,
//                    height:iframe.height,
//                    src : document.querySelector(".mobfox_iframe").parentNode.nextSibling.src,
//                    nextElmClass : document.querySelector(".mobfox_iframe").parentNode.nextElementSibling.nextElementSibling.className,
//                    offset : $(iframe).offset()
//                };
//
//            }).then(function(_data){
//                data = _data;
//                test.ok(data.id.match(/^mobfox_test$/));
//                test.equal(data.width,"320");
//                test.equal(data.height,"50");
//                test.ok(data.src.match(/ad\.js/));
//                test.equal(data.nextElmClass,"green");
//                page.sendEvent('click',data.offset.left+5,data.offset.top +5);
//            });
//        });
//
//        
//    });
//
//
//    page.on('onNavigationRequested',function(url, type, willNavigate, main) {
//        //ad clicked, finish test
//        if(url==="http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f"){
//            test.equal(url,"http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f","Navigate to landing page.");
//            test.done();
//        }
//    });
//
//    page.open('http://localhost:58080/banner-static-one-tag.html');
//
//};
////-----------------------------------------
//module.exports.testBannerOneTagHead = function (test) {
//
//    test.expect(6);
//    var loaded = false,
//        data;
//
//    page.on('onLoadFinished', function(status) {
//        if(loaded) return;
//        if(status === "success") loaded = true;
//
//        page.includeJs('https://code.jquery.com/jquery-2.1.3.min.js').then(function(){
//            page.evaluate(function() {
//                var iframe = document.querySelector(".mobfox_iframe");
//
//                return {
//                    id:iframe.id,
//                    srcdoc : iframe.srcdoc,
//                    width:iframe.width,
//                    height:iframe.height,
//                    adParentTag :document.querySelector(".mobfox_iframe").parentNode.parentNode.tagName,
//                    adNextSibling :document.querySelector(".mobfox_iframe").parentNode.nextElementSibling,
//                    offset : $(iframe).offset()
//                };
//
//            }).then(function(_data){
//                data = _data;
//                test.ok(data.id.match(/^mobfox_test$/));
//                test.equal(data.width,"320");
//                test.equal(data.height,"50");
//                test.equal(data.adParentTag.toLowerCase(),"body");
//                test.equal(data.adNextSibling.src,"https://code.jquery.com/jquery-2.1.3.min.js");
//                page.sendEvent('click',data.offset.left+5,data.offset.top +5);
//            });
//        });
//
//        
//    });
//
//
//    page.on('onNavigationRequested',function(url, type, willNavigate, main) {
//        //ad clicked, finish test
//        if(url==="http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f"){
//            test.equal(url,"http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f","Navigate to landing page.");
//            test.done();
//        }
//    });
//
//    page.open('http://localhost:58080/banner-static-one-tag-head.html');
//
//};
//-----------------------------------------
module.exports.validateTagInBody = function (test) {
    standardPageTest(
        test,
        'http://localhost:58080/banner-in-body.html',
        'http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f'
    );

};
//-----------------------------------------
module.exports.validateTagInHead = function (test) {
    standardPageTest(
        test,
        'http://localhost:58080/banner-in-head.html',
        'http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f'
    );

};
//-----------------------------------------
module.exports.validateSecureParam = function (test) {
    testSecure(
        test,
        'http://localhost:58080/banner-secure.html'
    );

};
//-----------------------------------------
module.exports.validateSmart = function (test) {
    testSmart(
        test,
        'http://localhost:58080/banner-smart.html'
    );

};
//-----------------------------------------
module.exports.validateVideoCollect = function (test) {
    testVideoCollect(
        test,
        'http://localhost:58080/video.html'
    );

};
//-----------------------------------------
//module.exports.testBannerNested = function (test) {
//
//    standardPageTest(
//        test,
//        'http://localhost:58080/banner-static-nested.html',
//        'http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f'
//    );
//
//};
////-----------------------------------------
//module.exports.testBannerNestedHead = function (test) {
//
//    standardPageTest(
//        test,
//        'http://localhost:58080/banner-static-nested-head.html',
//        'http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f'
//    );
//
//};
////-----------------------------------------
//module.exports.testBannerStarbolt = function (test) {
//
//    standardPageTest(
//        test,
//        'http://localhost:58080/banner-static-starbolt.html',
//        'https://play.google.com/store/apps/details?id=com.topgames.FighterCowboy.en'
//    );
//
//};
//
////-----------------------------------------
//module.exports.testBannerNestedStarbolt = function (test) {
//    standardPageTest(
//        test,
//        'http://localhost:58080/banner-static-nested-starbolt.html',
//        'https://play.google.com/store/apps/details?id=com.topgames.FighterCowboy.en'
//    );
//};
////-----------------------------------------
//module.exports.testBannerNestedHeadStarbolt = function (test) {
//
//    standardPageTest(
//        test,
//        'http://localhost:58080/banner-static-nested-head-starbolt.html',
//        'https://play.google.com/store/apps/details?id=com.topgames.FighterCowboy.en'
//    );
//};
////-----------------------------------------
//module.exports.testBannerNestedHeadStarbolt = function (test) {
//
//    standardPageTest(
//        test,
//        'http://localhost:58080/banner-static-nested-head-starbolt.html',
//        'https://play.google.com/store/apps/details?id=com.topgames.FighterCowboy.en'
//    );
//};
////-----------------------------------------
//module.exports.testBannerOneScript = function (test) {
//
//    test.expect(5);
//    var loaded = false,
//        data;
//
//    page.on('onLoadFinished', function(status) {
//        if(loaded) return;
//        if(status === "success") loaded = true;
//
//        page.includeJs('https://code.jquery.com/jquery-2.1.3.min.js').then(function(){
//            page.evaluate(function() {
//                var iframe = document.querySelector(".mobfox_iframe");
//
//                return {
//                    id:iframe.id,
//                    width:iframe.width,
//                    height:iframe.height,
//                    beforeMobfoxConfig : document.querySelector(".mobfox_iframe").parentNode.nextSibling.id === "mobfoxConfig",
//                    offset : $(iframe).offset()
//                };
//
//            }).then(function(_data){
//                data = _data;
//                test.ok(data.id.match(/^mobfox_test$/));
//                test.equal(data.width,"320");
//                test.equal(data.height,"50");
//                test.ok(data.beforeMobfoxConfig);
//                page.sendEvent('click',data.offset.left+5,data.offset.top +5);
//            });
//        });
//
//        
//    });
//
//
//    page.on('onNavigationRequested',function(url, type, willNavigate, main) {
//        //ad clicked, finish test
//        if(url==="http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f"){
//            test.equal(url,"http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f","Navigate to landing page.");
//            test.done();
//        }
//    });
//
//    page.open('http://localhost:58080/banner-static-one-script.html');
//
//
//};
////-----------------------------------------
//module.exports.testBannerOneScript = function (test) {
//
//    test.expect(5);
//    var loaded = false,
//        data;
//
//    page.on('onLoadFinished', function(status) {
//        if(loaded) return;
//        if(status === "success") loaded = true;
//
//        page.includeJs('https://code.jquery.com/jquery-2.1.3.min.js').then(function(){
//            page.evaluate(function() {
//                var iframe = document.querySelector(".mobfox_iframe");
//
//                return {
//                    id:iframe.id,
//                    width:iframe.width,
//                    height:iframe.height,
//                    beforeMobfoxConfig : document.querySelector(".mobfox_iframe").parentNode.nextSibling.id === "mobfoxConfig",
//                    offset : $(iframe).offset()
//                };
//
//            }).then(function(_data){
//                data = _data;
//                test.ok(data.id.match(/^mobfox_test$/));
//                test.equal(data.width,"320");
//                test.equal(data.height,"50");
//                test.ok(data.beforeMobfoxConfig);
//                page.sendEvent('click',data.offset.left+5,data.offset.top +5);
//            });
//        });
//
//        
//    });
//
//
//    page.on('onNavigationRequested',function(url, type, willNavigate, main) {
//        //ad clicked, finish test
//        if(url==="http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f"){
//            test.equal(url,"http://my.mobfox.com/exchange.click.php?h=c9400133ac5b182d10a130c99bf9035f","Navigate to landing page.");
//            test.done();
//        }
//    });
//
//    page.open('http://localhost:58080/banner-static-one-script.html');
//
//
//};
////-----------------------------------------
//module.exports.testWithClass = function (test) {
//
//    test.expect(4);
//    var loaded = false,
//        data;
//
//    page.on('onLoadFinished', function(status) {
//        if(loaded) return;
//        if(status === "success") loaded = true;
//
//        page.includeJs('https://code.jquery.com/jquery-2.1.3.min.js').then(function(){
//            page.evaluate(function() {
//                var iframe = document.querySelector(".mobfox_iframe");
//                return {
//                    id:iframe.id,
//                    width:iframe.width,
//                    height:iframe.height,
//                    beforeMobfoxConfig : document.querySelector(".mobfox_iframe").parentNode.nextSibling.className === "mobfoxConfig",
//                    offset : $(iframe).offset()
//                };
//
//            }).then(function(_data){
//                data = _data;
//                test.ok(data.id.match(/^mobfox_\d+$/));
//                test.equal(data.width,"320");
//                test.equal(data.height,"50");
//                test.ok(data.beforeMobfoxConfig);
//                test.done();
//            });
//        });
//
//        
//    });
//
//    page.open('http://localhost:58080/banner-test-class.html');
//};
////-----------------------------------------
//module.exports.multi = function (test) {
//    test.expect(0);
//    var pixels = 0;
//    page.on('onResourceReceived',function(response){
//        if(response.url === "http://my.mobfox.com/exchange.pixel.php?h=af1cac2831727a105f48a9fc09df9847"){
//            pixels++;
//            if(pixels === 2) test.done();
//        }
//    });
//    page.open('http://localhost:58080/multi.html');
//};
////-----------------------------------------
//module.exports.passback = function (test) {
//
//    test.expect(1);
//    page.on('onConsoleMessage',function(msg, lineNum, sourceId) {
//        test.equal(msg,"nothing to show here.");
//        test.done();
//    });
//    page.open('http://localhost:58080/passback.html');
//
//};
////-----------------------------------------
//module.exports.passbackTimeout = function (test) {
//
//    test.expect(1);
//    page.on('onConsoleMessage',function(msg, lineNum, sourceId) {
//        test.equal(msg,"nothing to show here.");
//        test.done();
//    });
//    page.open('http://localhost:58080/passback.html');
//
//};
////-----------------------------------------
//
//module.exports.passbackTagDFP = function (test) {
//
//    test.expect(1);
//    page.on('onConsoleMessage',function(msg, lineNum, sourceId) {
//        test.equal(msg,"ya ya ya!");
//        test.done();
//    });
//    page.open('http://localhost:58080/passback-tag-dfp.html');
//
//};
////-----------------------------------------
//module.exports.passbackOneTag = function (test) {
//
//    test.expect(1);
//    page.on('onConsoleMessage',function(msg, lineNum, sourceId) {
//        test.equal(msg,"ya ya ya!");
//        test.done();
//    });
//    page.open('http://localhost:58080/passback-one-tag.html');
//
//};
////-----------------------------------------
//
//module.exports.passbackTag = function (test) {
//
//    test.expect(1);
//    page.on('onConsoleMessage',function(msg, lineNum, sourceId) {
//        test.equal(msg,"ya ya ya!");
//        test.done();
//    });
//    page.open('http://localhost:58080/passback-tag.html');
//
//};
////-----------------------------------------
//
//module.exports.passbackTagMobFoxTag = function (test) {
//
//    test.expect(1);
//    page.on('onConsoleMessage',function(msg, lineNum, sourceId) {
//        test.equal(msg,"ya ya ya!");
//        test.done();
//    });
//    page.open('http://localhost:58080/passback-tag-mobfoxTag.html');
//
//};
//-----------------------------------------
/*
module.exports.passbackTagMulti = function (test) {

    test.expect(3);


    var adCalls = 0,done=false;

    page.on("onResourceReceived",function(resp) {
        
        if(resp.url.match(/http:\/\/my\.mobfox\.com\/request\.php/)) return;

        adCalls++;
        if(!done && adCalls === 2){
            done = true;
            setTimeout(function(){

                page.evaluate(function(){


                    if(!document.querySelector("#first iframe") || document.querySelector("#second iframe")) return null;
                    return {
                                iframeCount : document.querySelectorAll("iframe").length,
                                textFirst   : document.querySelector("#first iframe").contentWindow.document.querySelector("h1").textContent.trim(),
                                textSecond  : document.querySelector("#second iframe").contentWindow.document.querySelector("h1").textContent.trim()
                    };
                
                }).then(function(data){
                    console.log("data: "+data);
                    if(!data) return;
                    console.log(data);
                    test.equal(iframeCount,2);
                    test.equal(textFirst,"Hello");
                    test.equal(textSecond,"Goodbye");
                    test.done(); 
                });

               
            },100);
        }
    });

    page.open('http://localhost:58080/passback-tag-multi.html');

};*/
//-----------------------------------------

