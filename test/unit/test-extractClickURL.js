var fs              = require('fs'),
    path            = require('path'),
    extractClickURL = require("../../src/extractClickURL");

process.chdir(path.dirname(module.filename));
//---------------------------------------------------
exports.testExtractGotoURL = function(test){
    test.expect(1);
    var html = fs.readFileSync("ads/gotourl.html",{encoding:"utf-8"});
    extractClickURL(html,function(err,clickURL){
        test.equal(clickURL,'https://play.google.com/store/apps/details?id=com.topgames.FighterCowboy.en');
        test.done();
    });
};
//---------------------------------------------------
exports.testExtractDataClickURL = function(test){
    test.expect(1);
    var html = fs.readFileSync("ads/data-clickurl.html",{encoding:"utf-8"});
    extractClickURL(html,function(err,clickURL){
        test.equal(clickURL,'https://play.google.com/store/apps/details?id=com.topgames.FighterCowboy.en');
        test.done();
    });
};
//---------------------------------------------------
exports.testExtractNoURL = function(test){
    test.expect(1);
    var html = fs.readFileSync("ads/no-url.html",{encoding:"utf-8"});
    extractClickURL(html,function(err,clickURL){
        test.ok(!clickURL);
        test.done();
    });
};
//---------------------------------------------------
exports.testExtractNuggetsIFrameURL = function(test){
    test.expect(1);
    var html = fs.readFileSync("ads/nuggets-iframe.html",{encoding:"utf-8"});
    extractClickURL(html,function(err,clickURL){
        test.equal(clickURL,"http://tracker.mtrtb.com/tracker/click/?d=ZMdXVpZD1iOTY5YWZkNy05ZmQxLTExZTQtOTNkZi0wYTJiNmNkNTNlZTEmY2FtcGFpZ25faWQ9MTAwJmNjcmlkPTEzMSZiaWRfdHM9MTQyMTY2ODM4MzU2NyZkcGlkc2hhMT0mY2FtcGFpZ25faWQ9MTAw");
        test.done();
    });
};
//---------------------------------------------------
