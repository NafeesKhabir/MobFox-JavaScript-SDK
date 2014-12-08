(function(){
    var Qs      = require('qs'),
        confE   = document.getElementById("mobfoxConfig"),
        mobfoxVar   = "mobfox_" + String(Math.random()).slice(2),
        refreshInterval;

    createAd = {
        banner : function(ad,ad_id,confElement){
            var iframe = document.getElementById(mobfoxVar);
            if(iframe){
                iframe.parentNode.removeChild(iframe);
            }

            iframe = document.createElement("iframe");
            iframe.id = ad_id;
            iframe.className = "mobfox_iframe"; 
            iframe.width= mobfoxConfig.width;
            iframe.height= mobfoxConfig.height;
            iframe.src= ["data:text/html;charset=utf-8,","<html>",ad,"</html>"].join("\n");
            confE.parentNode.insertBefore(iframe,confElement);
            iframe.style.margin = "0px";
            iframe.style.padding= "0px";
            iframe.style.border= "none";
        },
        interstitial : function(ad,ad_id,confElement){
            var adContainer = document.getElementById('mobfox_interstitial');
            if(adContainer){
                adContainer.parentNode.removeChild(iframe);
            }

            adContainer = document.createElement('iframe'); 
            adContainer.style.width  = window.innerWidth + "px";
            adContainer.style.height = window.innerHeight + "px";
            adContainer.style.zIndex = "1000000";
            adContainer.style.backgroundColor = "transparent";
            adContainer.style.position = "fixed";
            adContainer.style.left = "0px";
            adContainer.style.top = "0px";
            adContainer.style.margin = "0px";
            adContainer.style.padding= "0px";
            adContainer.style.border= "none";
            document.body.appendChild(adContainer);
            
            adContainer.contentWindow.document.body.style.margin = "0px";
            var iframe = adContainer.contentWindow.document.createElement('iframe');
            iframe.id = ad_id;
            iframe.width= mobfoxConfig.width;
            iframe.height= mobfoxConfig.height;
            iframe.src= ["data:text/html;charset=utf-8,","<html>",ad,"</html>"].join("\n");
            adContainer.contentWindow.document.body.appendChild(iframe);
            iframe.style.margin = "0px auto";
            iframe.style.padding= "0px";
            iframe.style.border= "none";
            iframe.style.display= "block";

            var button = adContainer.contentWindow.document.createElement('button');
            adContainer.contentWindow.document.body.appendChild(button);
            button.innerHTML = "X";
            button.onclick = function(){
               adContainer.parentNode.removeChild(adContainer); 
            };
            button.style.position   = "absolute";
            button.style.width      = "50px";
            button.style.height     = "50px";
            button.style.top        = "10px";
            button.style.right      = "10px";
        }
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
                s       : mobfoxConfig.publisherID,
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
        script.src = 'http://my.mobfox.com/request.php?' + Qs.stringify(params);

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
