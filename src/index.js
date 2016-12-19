(function(){

    var Qs              = require('./query-string'),
        URL             = require('./lite-url').liteURL,
        ads             = require('./ads.js'),
        appendPassback  = require('./appendPassback.js'),
        curScript       = document.currentScript || (function() {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })(),
        confE           = curScript && curScript.previousElementSibling,
        confMatch       = curScript && curScript.src.match(/conf_id=(\d+)/),
        confID          = confMatch && confMatch[1],
        mobfoxVar       = "mobfox_" + String(Math.random()).slice(2),
        createAd        = {
            banner          : ads.createBanner,
            interstitial    : ads.createInterstitial,
            floating        : ads.createFloating
        }, 
        refreshInterval;

    var mobfoxConfig = URL(curScript.src).params;

    if(mobfoxConfig){//no conf element position it behind script
        confE = curScript;
    }

    //START: backward compat code
    if(!mobfoxConfig || (!mobfoxConfig.publicationID && !mobfoxConfig.pid && !mobfoxConfig.invh)){
        if(confID){
            mobfoxConfig = window.mobfoxConfig[confID];
            confE = document.querySelector('#mobfoxConf_'+confID);
        }
        else if(curScript.dataset.mobfoxconf){
            confID = curScript.dataset.mobfoxconf;
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
    }
    //END: backward compat code
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
                "demo_gender",
                "demo_keyword",
                "demo_age",
                "adspace_strict",
                "no_markup",
                "s_subid",
                "sub_domain",
                //"sub_bundle_id",
                "allow_mr",
                "r_floor" ,
                "testURL",
                "referrer"
            ],
            params = {
                r_type                  : 'banner',//mobfoxConfig.type,
                u                       : window.navigator.userAgent,
                s                       : mobfoxConfig.publicationID || mobfoxConfig.invh || mobfoxConfig.pid,
                p                       : mobfoxConfig.referrer || window.location.href,
                m                       : mobfoxConfig.debug ? 'test' : 'live',
                rt                      : 'javascript',
                v                       : '3.0',
                'adspace_width'         : mobfoxConfig.width,
                'adspace_height'        : mobfoxConfig.height,
                timeout                 : mobfoxConfig.timeout,
                jsvar                   : mobfoxVar,
                'h[Referer]'            : mobfoxConfig.referrer || document.referrer,
                c_mraid                 : 0
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

        if(mobfoxConfig.referrer && !params.sub_domain && mobfoxConfig.referrer.indexOf("http")===0){
            params.sub_domain = URL(mobfoxConfig.referrer).hostname;
        }
        else if(mobfoxConfig.referrer && !params.sub_domain && mobfoxConfig.referrer.match(/^(\w+\.){0,2}\w+\.\w+$/)){
            params.sub_domain = mobfoxConfig.referrer;
        }

        //verify width / height
        var w = parseInt(params.adspace_width),
            h = parseInt(params.adspace_height);

        if(w !=w || w < 0) throw "Invalid adspace_width: " + params.adspace_width;
        if(h !=h || h < 0) throw "Invalid adspace_height: " + params.adspace_height;

        var url = params.testURL || '//my.mobfox.com/request.php';
        script.type = "text/javascript";
        script.onload = script.onerror = function(){

            script.parentNode.removeChild(script);
            if(!window[mobfoxVar]){

                window.clearInterval(refreshInterval);

                if(mobfoxConfig.passback){
                    if(typeof(mobfoxConfig.passback) === "function"){
                        mobfoxConfig.passback();
                    }
                    else if(typeof(mobfoxConfig.passback) === "string"){
                        appendPassback(window,confE,mobfoxConfig.passback,{width:mobfoxConfig.width,height:mobfoxConfig.height,confID:confID,noIFrame:mobfoxConfig.noIFrame},function(err){
                            //...
                        });
                    }
                }
                return;
            }
            else{
                if(typeof(mobfoxConfig.onAdLoaded) === "function"){
                    mobfoxConfig.onAdLoaded();
                }
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
