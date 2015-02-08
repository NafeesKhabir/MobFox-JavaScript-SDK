var fs              = require('fs'),
    path            = require('path'),
    jsdom           = require("jsdom"),
    appendPassback  = require('../../src/appendPassback');

process.chdir(path.dirname(module.filename));
//---------------------------------------------------
exports.testParsePassback = function(test){

    test.expect(2);

    jsdom.env(
      '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <title></title> </head> <body> </body> </html>',
      [],
      function (errors, window) {
        var passback = fs.readFileSync("./ads/passback.html",{encoding:"utf-8"});

        appendPassback(window,null,passback,function(err){
            var scripts = window.document.querySelectorAll("script");
            test.ok(scripts[0].innerHTML.indexOf("var adParams = {a: '55253013', size: '320x50',serverdomain: 's.ad132m.com'  ,context:'c55163113' };"));
            test.equals(scripts[1].src,"http://creative.ad132m.com/ad132m/scripts/smart/smart.js");
            test.done();
        });
      }
    );
    
};

//---------------------------------------------------
exports.testParsePassbackWithRefElement = function(test){

    test.expect(4);

    jsdom.env(
      '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <title></title> </head> <body> <div id="ref"></div> </body> </html>',
      [],
      function (errors, window) {
        var passback = fs.readFileSync("./ads/passback.html",{encoding:"utf-8"});
        appendPassback(window,window.document.querySelector("#ref"),passback,function(err){
            var scripts = window.document.querySelectorAll("script");
            test.ok(scripts[0].innerHTML.indexOf("var adParams = {a: '55253013', size: '320x50',serverdomain: 's.ad132m.com'  ,context:'c55163113' };"));
            test.equals(scripts[1].src,"http://creative.ad132m.com/ad132m/scripts/smart/smart.js");
            test.equals(scripts[0].nextSibling.src,scripts[1].src);
            test.equals(scripts[1].nextSibling.id,"ref");
            test.done();
        });
      }
    );
    
};

