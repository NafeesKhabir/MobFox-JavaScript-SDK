(function(){

    var Qs              = require('qs'),
        ads             = require('./ads.js'),
        appendPassback  = require('./appendPassback.js'),
        confE = document.currentScript && document.currentScript.previousElementSibling,
        confMatch = document.currentScript && document.currentScript.src.match(/conf_id=(\d+)/),
        confID = confMatch && confMatch[1],
        mobfoxVar       = "mobfox_" + String(Math.random()).slice(2),
        refreshInterval,
        createAd = {
            banner          : ads.createBanner,
            interstitial    : ads.createInterstitial,
            floating        : ads.createFloating
        }; 

    var mobfoxConfig;
    if(confID){
        mobfoxConfig = window.mobfoxConfig[confID];
        confE = document.querySelector('#mobfoxConf_'+confID);
    }
    else if(document.currentScript.dataset.mobfoxconf){
        confID = document.currentScript.dataset.mobfoxconf;
        mobfoxConfig = window.mobfoxConfig[confID];
        confE = document.querySelector("#"+confID);
    }
    else{
        if(!confE || confE.className.indexOf("mobfoxConfig") < 0){
            confE = document.querySelector('.mobfoxConfig');
            if(!confE){
                confE = document.querySelector("#mobfoxConfig");
            }
        }

        if(confE.innerHTML){
            eval(confE.innerHTML);
        }
        mobfoxConfig = window.mobfoxConfig;
    }
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

        //var start = (new Date()).getTime();


        var url = params.testURL || 'http://my.mobfox.com/request.php';
        script.type = "text/javascript";
        script.onload = script.onerror = function(){
            //var end = (new Date()).getTime();

            script.parentNode.removeChild(script);
            if(!window[mobfoxVar]){

                window.clearInterval(refreshInterval);

                if(mobfoxConfig.passback){
                    if(typeof(mobfoxConfig.passback) === "function"){
                        mobfoxConfig.passback();
                    }
                    else if(typeof(mobfoxConfig.passback) === "string"){
                        appendPassback(window,confE,mobfoxConfig.passback,{width:mobfoxConfig.width,height:mobfoxConfig.height,confID:confID},function(err){
                            //...
                        });
                    }
                }
                return;
            }


            mobfoxConfig.timeout = params.timeout;
            createAd[mobfoxConfig.type](window[mobfoxVar][0],mobfoxVar,confE,mobfoxConfig);

        };

        script.src = url + '?' + Qs.stringify(params);
        document.head.appendChild(script);

    }
    //-------------------------------------------

    if(mobfoxConfig.refresh){
        refreshInterval = setInterval(retrieve,mobfoxConfig.refresh);
    }
    retrieve();

})();
