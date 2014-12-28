(function(){

    var Qs                  = require('qs'),
        superagent          = require('superagent'),
        createNativeAd      = require('./native-ads.js').createNativeAd,
        confE               = document.getElementById("mobfoxConfig"),
        options = [
                "o_androidid",
                "o_androidimei",
                "o_iosadvid",
                "o_andadvid",
                "longitude",
                "latitude",
                "demo.gender",
                "demo.keyword",
                "demo.age",
                "adspace.strict",
                "no_markup",
                "s_subid",
                "allow_mr",
                "r_floor" 
        ],
        params = {
                /*r_type  : 'native',
                r_resp  : 'json',
                u       : window.navigator.userAgent,
                s       : mobfoxConfig.publicationID,
                p       : window.location.href,
                m       : mobfoxConfig.debug ? 'test' : 'live',
                rt      : 'api',
                v       : '3.0',
                n_img   : 'icon',
                n_text  : 'headline',
                i       : "127.0.0.1",
                o_iosadvid : "68753A44-4D6F-1226-9C60-0050E4C00067"*/

                rt : 'api',
                r_type : 'native',
                v       : '3.0',
                r_resp : 'json',
                n_img : 'icon',
                n_txt : 'headline',
                s     : '80187188f458cfde788d961b6882fd53',
                //s       : mobfoxConfig.publicationID,
                //i     : '2.122.29.194',
                i       : "8.8.8.8",
                u     : 'Mozilla/5.0%20(iPhone;%20U;%20CPU%20iPhone%20OS%203_0%20like%20Mac%20OS%20X;%20en-us)%20AppleWebKit/528.18%20(KHTML,%20like%20Gecko)%20Version/4.0%20Mobile/7A341%20Safari/528.16',
                o_iosadvid : '68753A44-4D6F-1226-9C60-0050E4C00067'
        };
   
        options.forEach(function(o){
            if(typeof(mobfoxConfig[o]) !== 'undefined'){
                params[o] = mobfoxConfig[o];
            }
        });

        superagent
            .get('http://my.mobfox.com/request.php?' + Qs.stringify(params))
            .end(function(res){
                console.log(res.body);
                //createNativeAd(window[mobfoxVar][0].content,mobfoxVar,confE);
            });

})();