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
