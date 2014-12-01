(function(){
    var Qs      = require('qs'),
        confE   = document.getElementById("mobfoxConfig"),
        mobfoxVar   = "mobfox_" + String(Math.random()).slice(2),
        refreshInterval;

    //-------------------------------------------
    function retrieve(){

        var script  = document.createElement("script"),
            params = {
                r_type  : mobfoxConfig.type,
                u       : window.navigator.userAgent,
                s       : mobfoxConfig.publisherID,
                //m       : 'test',
                m       : 'live',
                rt      : 'javascript',
                v       : '3.0',
                'adspace.width' : mobfoxConfig.width,
                'adspace.height' : mobfoxConfig.height,
                jsvar : mobfoxVar
            };

        confE.parentNode.insertBefore(script,confE);
        script.src = 'http://my.mobfox.com/request.php?' + Qs.stringify(params);

        script.onload = function(){

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

            var iframe = document.getElementById(mobfoxVar);
            if(iframe){
                iframe.parentNode.removeChild(iframe);
            }

            iframe = document.createElement("iframe");
            iframe.id = mobfoxVar;
            iframe.width= mobfoxConfig.width;
            iframe.height= mobfoxConfig.height;
            //iframe.innerHTML= ["<html>",window[mobfoxVar][0].content,"</html>"].join("\n");
            iframe.src= ["data:text/html;charset=utf-8,","<html>",window[mobfoxVar][0].content,"</html>"].join("\n");
            confE.parentNode.insertBefore(iframe,confE);
            iframe.style.margin = "0px";
            iframe.style.padding= "0px";
            iframe.style.border= "none";
          
            script.parentNode.removeChild(script);
        };
    }
    //-------------------------------------------

    if(mobfoxConfig.refresh){
        refreshInterval = setInterval(retrieve,mobfoxConfig.refresh);
    }
    retrieve();

})();
