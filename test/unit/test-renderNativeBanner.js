var fs              = require('fs'),
    renderNativeAd  = require('../../src/native-ads').renderNativeAd,
    tmpl            = fs.readFileSync('../../src/templates/native-banner.tmpl',{encoding:"utf-8"}),
    data            = require('./ads/native.json'),
    cheerio = require('cheerio'),
    options = {
        rt : 'api',
        r_type : 'native',
        v       : '3.0',
        r_resp : 'json',
        n_img : 'icon',
        n_txt : 'headline',
        publicationID: '4b6aecf90c16273c6e6da928084543b1',
        referenceE : null,
        type:"banner",
        replace : true,
        i : "8.8.8.8",
        u     : 'Mozilla/5.0%20(iPhone;%20U;%20CPU%20iPhone%20OS%203_0%20like%20Mac%20OS%20X;%20en-us)%20AppleWebKit/528.18%20(KHTML,%20like%20Gecko)%20Version/4.0%20Mobile/7A341%20Safari/528.16',
        o_iosadvid : '68753A44-4D6F-1226-9C60-0050E4C00067'
    };

//---------------------------------------------------
exports.testRenderBannerAdBasic = function(test){
    var opts = JSON.parse(JSON.stringify(options)); 
    var ad = renderNativeAd(data,tmpl,opts);
    $ = cheerio.load(ad);
    test.equal($("a>img").length,1);
    test.done();
};
//---------------------------------------------------
exports.testRenderBannerAdHeading = function(test){
    var opts = JSON.parse(JSON.stringify(options)); 
    opts.headline = true;
    var ad = renderNativeAd(data,tmpl,opts);
    $ = cheerio.load(ad);
    test.equal($("a>img").length,1);
    test.equal($("a>h3.headline").length,1);
    test.done();
};
//---------------------------------------------------

