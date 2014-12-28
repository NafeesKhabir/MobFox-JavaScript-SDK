(function(){

    var Qs      = require('qs'),
        ads     = require('./ads.js'),
        confE   = document.getElementById("mobfoxConfig"),
        mobfoxVar   = "mobfox_" + String(Math.random()).slice(2),
        refreshInterval,
        createAd = {
            banner          : ads.createBanner,
            interstitial    : ads.createInterstitial,
            floating        : ads.createFloating
        }; 
    //-------------------------------------------
    function retrieve(){

        var script  = document.createElement("script"),
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
                r_type  : 'banner',//mobfoxConfig.type,
                u       : window.navigator.userAgent,
                s       : mobfoxConfig.publicationID,
                p       : window.location.href,
                m       : mobfoxConfig.debug ? 'test' : 'live',
                rt      : 'javascript',
                v       : '3.0',
                'adspace.width' : mobfoxConfig.width,
                'adspace.height' : mobfoxConfig.height,
                jsvar : mobfoxVar
            };

   
        options.forEach(function(o){
            if(typeof(mobfoxConfig[o]) !== 'undefined'){
                params[o] = mobfoxConfig[o];
            }
        });

        confE.parentNode.insertBefore(script,confE);
        //var start = (new Date()).getTime();
        if(mobfoxConfig.publicationID === "test"){
            if(mobfoxConfig.type === "interstitial"){
                if(mobfoxConfig.testID){
                    script.src = "/js/response-inter-"+mobfoxConfig.testID+".js";
                }
                else{
                    script.src = "/js/response-inter.js";
                }
            }
            else{
                if(mobfoxConfig.testID){
                    script.src = "/js/response-banner-"+mobfoxConfig.testID+".js";
                }
                else{
                    script.src = "/js/response-banner.js";
                }
            }
            mobfoxVar = "mobfox_test";
        }
        else{
            script.src = 'http://my.mobfox.com/request.php?' + Qs.stringify(params);
        }

        script.onload = function(){
            //var end = (new Date()).getTime();
            if(!window[mobfoxVar]){

                window.clearInterval(refreshInterval);

                script.parentNode.removeChild(script);
                if(mobfoxConfig.passback){
                    if(typeof(mobfoxConfig.passback) === "function"){
                        mobfoxConfig.passback();
                    }
                    else if(typeof(mobfoxConfig.passback) === "string"){
                        eval(mobfoxConfig.passback+"()"); 
                    }
                }
                return;
            }

            createAd[mobfoxConfig.type](window[mobfoxVar][0].content,mobfoxVar,confE);

            script.parentNode.removeChild(script);
        };
    }
    //-------------------------------------------

    if(mobfoxConfig.refresh){
        refreshInterval = setInterval(retrieve,mobfoxConfig.refresh);
    }
    retrieve();

})();
