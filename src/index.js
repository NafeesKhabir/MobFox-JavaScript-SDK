(function(){

    var Qs              = require('qs'),
        ads             = require('./ads.js'),
        appendPassback  = require('./appendPassback.js'),
        confE = document.currentScript && document.currentScript.previousElementSibling,
        mobfoxVar       = "mobfox_" + String(Math.random()).slice(2),
        refreshInterval,
        createAd = {
            banner          : ads.createBanner,
            interstitial    : ads.createInterstitial,
            floating        : ads.createFloating
        }; 

    if(!confE || confE.className.indexOf("mobfoxConfig") < 0){
        confE = document.querySelector('.mobfoxConfig');
        if(!confE){
            confE = document.querySelector("#mobfoxConfig");
        }
    }
    eval(confE.innerHTML);
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
                "r_floor" ,
                "testURL"
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
                timeout : mobfoxConfig.timeout,
                jsvar : mobfoxVar
            };

   
        options.forEach(function(o){
            if(typeof(mobfoxConfig[o]) !== 'undefined'){
                params[o] = mobfoxConfig[o];
            }
        });

        if(params.testURL){
            if(!window.mobfoxCount) window.mobfoxCount = 1;
            params.jsvar = mobfoxVar = "mobfox_test" + (window.mobfoxCount > 1 ? window.mobfoxCount : "");
            window.mobfoxCount ++;
        }

        confE.parentNode.insertBefore(script,confE);
        //var start = (new Date()).getTime();


        var url = params.testURL || 'http://my.mobfox.com/request.php';
        script.type = "text/javascript";
        script.src = url + '?' + Qs.stringify(params);

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
                        appendPassback(window,confE,mobfoxConfig.passback,{width:mobfoxConfig.width,height:mobfoxConfig.height},function(err){
                            //...
                        });
                    }
                }
                return;
            }

            mobfoxConfig.timeout = params.timeout;
            createAd[mobfoxConfig.type](window[mobfoxVar][0],mobfoxVar,confE,mobfoxConfig);

            script.parentNode.removeChild(script);
        };
    }
    //-------------------------------------------

    if(mobfoxConfig.refresh){
        refreshInterval = setInterval(retrieve,mobfoxConfig.refresh);
    }
    retrieve();

})();
