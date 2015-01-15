var extractClickURL = require('./extractClickURL.js'),
    cleanAd = function(ad){
    
    var cleaned;
    if(ad.indexOf("</html>") > 0){
        /*var end = ad.match(/<\/html>(.*)$/);
        if(end){
            var pixel = end[1];
            console.log(pixel);
            cleaned = ad.replace(pixel,"");
        }*/
        cleaned = ad;
    }
    else if(ad.indexOf("</body>") > 0){
        cleaned = ["<html>",ad,"</html>"].join("\n");
    }
    else{
        cleaned = ["<html><body style='margin:0px;padding:0px;'>",ad,"</body></html>"].join("\n");
    }

    return cleaned;
};
//----------------------------------------------------------------
module.exports = {

    createBanner : function(ad,ad_id,confElement,mobfoxClickURL){
        var iframe = document.getElementById(ad_id);
        if(iframe){
            iframe.parentNode.removeChild(iframe);
        }

        var containerDiv = document.createElement("div");
        containerDiv.style.margin = "0px";
        containerDiv.style.padding= "0px";
        containerDiv.style.border= "none";   
        containerDiv.style.cursor= "pointer";   

        containerDiv.id = "container_"+ad_id;
        confElement.parentNode.insertBefore(containerDiv,confElement);

        var cleaned = cleanAd(ad.content);

        extractClickURL(cleaned,function(err,clickURL){

            containerDiv.onclick = function(){
                if(!clickURL){
                    window.location.href = ad.url;
                    return;
                }

                var registerMobfoxClick = document.createElement("script");
                registerMobfoxClick.src = ad.url;
                registerMobfoxClick.onload = registerMobfoxClick.onerror = function(){
                    window.location.href = clickURL;
                };
                document.body.appendChild(registerMobfoxClick);
            };

            iframe = document.createElement("iframe");
            iframe.id = ad_id;
            iframe.className = "mobfox_iframe"; 
            iframe.width= mobfoxConfig.width;
            iframe.height= mobfoxConfig.height;
            iframe.style.pointerEvents = "none";

            iframe.src = "data:text/html;charset=utf-8," + cleaned;

            containerDiv.appendChild(iframe);

            iframe.style.margin = "0px";
            iframe.style.padding= "0px";
            iframe.style.border= "none";   

            iframe.scrolling = "no";
            iframe.style.overflow = "hidden";
        });

        
    },

    createInterstitial : function(ad,ad_id,confElement,timeout){
            
        var adContainer = document.getElementById('mobfox_interstitial');
        if(adContainer){
            adContainer.parentNode.removeChild(iframe);
        }

        adContainer = document.createElement('iframe'); 
        adContainer.id = "mobfox_interstitial";
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

        var cleaned = cleanAd(ad.content);

        var containerDiv = adContainer.contentWindow.document.createElement("div");
        containerDiv.style.margin = "0px";
        containerDiv.style.padding= "0px";
        containerDiv.style.border= "none";   
        containerDiv.style.cursor= "pointer";   
        containerDiv.id = "container_"+ad_id;

        adContainer.contentWindow.document.body.appendChild(containerDiv);

        extractClickURL(cleaned,function(err,clickURL){

            containerDiv.onclick = function(){
                if(!clickURL){
                    window.location.href = ad.url;
                    return;
                }

                var registerMobfoxClick = document.createElement("script");
                registerMobfoxClick.src = ad.url;
                registerMobfoxClick.onload = registerMobfoxClick.onerror = function(){
                    window.location.href = clickURL;
                };
                document.body.appendChild(registerMobfoxClick);
            };


            var iframe = adContainer.contentWindow.document.createElement('iframe');
            iframe.id = ad_id;
            iframe.className = "mobfox_iframe";
            iframe.width= mobfoxConfig.width;
            iframe.height= mobfoxConfig.height;
            iframe.src = "data:text/html;charset=utf-8, "+escape(cleaned);
            iframe.style.pointerEvents = "none";

            containerDiv.appendChild(iframe);

            iframe.style.margin = "0px auto";
            iframe.style.padding= "0px";
            iframe.style.border= "none";
            iframe.style.display= "block";

            iframe.scrolling = "no";
            iframe.style.overflow = "hidden";

            var button = adContainer.contentWindow.document.createElement('canvas');
            adContainer.contentWindow.document.body.appendChild(button);

            button.onclick = function(){
               adContainer.parentNode.removeChild(adContainer); 
            };
            button.style.position   = "absolute";
            button.style.width      = "40px";
            button.style.height     = "40px";
            button.style.top        = "10px";
            button.style.right      = "10px";   
            button.width = 40;
            button.height = 40;
            button.style.cursor = "pointer";
            button.id = "mobfox_dismiss"; 

            var ctx = button.getContext('2d');
            ctx.rect(0,0,40,40);
            ctx.fillStyle="#fff";
            ctx.fill();

            ctx.strokeStyle = '#000';
            ctx.lineWidth = 4;

            ctx.rect(0,0,40,40);
            ctx.stroke();

            ctx.lineWidth = 8;
            ctx.beginPath();

            ctx.moveTo(10, 10);
            ctx.lineTo(30, 30);

            ctx.moveTo(10, 30);
            ctx.lineTo(30, 10);
            ctx.stroke();

            setTimeout(function(){
               adContainer.parentNode.removeChild(adContainer); 
            },timeout || 16000);
        });
    },
    createFloating : function(ad,ad_id,confElement){
        
        var adContainer = document.getElementById('mobfox_floating');
        if(adContainer){
            adContainer.parentNode.removeChild(iframe);
        }

        adContainer = document.createElement('iframe'); 
        adContainer.id = "mobfox_floating";

        adContainer.style.width= mobfoxConfig.width+"px";
        adContainer.style.height= mobfoxConfig.height+"px";

        adContainer.style.zIndex = "1000000";
        adContainer.style.position = "fixed";
        adContainer.style.bottom = "0px";
        adContainer.style.margin = "0px";
        adContainer.style.padding= "0px";
        adContainer.style.border= "none";
        document.body.appendChild(adContainer);
        
        adContainer.contentWindow.document.body.style.margin = "0px";

        var cleaned = cleanAd(ad.content);

        var containerDiv = adContainer.contentWindow.document.createElement("div");

        containerDiv.style.margin = "0px";
        containerDiv.style.padding= "0px";
        containerDiv.style.border= "none";   
        containerDiv.style.cursor= "pointer";   
        containerDiv.id = "container_"+ad_id;

        adContainer.contentWindow.document.body.appendChild(containerDiv);

        extractClickURL(cleaned,function(err,clickURL){

            containerDiv.onclick = function(){
                if(!clickURL){
                    window.location.href = ad.url;
                    return;
                }

                var registerMobfoxClick = document.createElement("script");
                registerMobfoxClick.src = ad.url;
                registerMobfoxClick.onload = registerMobfoxClick.onerror = function(){
                    window.location.href = clickURL;
                };
                document.body.appendChild(registerMobfoxClick);
            };

            var iframe = adContainer.contentWindow.document.createElement('iframe');
            iframe.id = ad_id;
            iframe.className = "mobfox_iframe";
            iframe.width= mobfoxConfig.width;
            iframe.height= mobfoxConfig.height;
            iframe.src = "data:text/html;charset=utf-8, "+escape(cleanAd(ad.content));

            //center it
            adContainer.style.left = ((window.innerWidth - parseInt(adContainer.style.width)) / 2) + "px";

            iframe.style.margin = "0px auto";
            iframe.style.padding= "0px";
            iframe.style.border= "none";
            iframe.style.display= "block";

            iframe.scrolling = "no";
            iframe.style.overflow = "hidden";

            if(mobfoxConfig.closeButton === false) return;

            var button = adContainer.contentWindow.document.createElement('canvas');
            adContainer.contentWindow.document.body.appendChild(button);

            containerDiv.appendChild(iframe);

            button.onclick = function(){
               adContainer.parentNode.removeChild(adContainer); 
            };
            button.style.position   = "absolute";
            button.style.width      = "20px";
            button.style.height     = "20px";
            button.style.top        = "5px";
            button.style.right      = "5px";   
            button.width = 40;
            button.height = 40;
            button.style.cursor = "pointer";
            button.id = "mobfox_dismiss"; 

            var ctx = button.getContext('2d');
            ctx.rect(0,0,40,40);
            ctx.fillStyle="#fff";
            ctx.fill();

            ctx.strokeStyle = '#000';
            ctx.lineWidth = 4;

            ctx.rect(0,0,40,40);
            ctx.stroke();

            ctx.lineWidth = 8;
            ctx.beginPath();

            ctx.moveTo(10, 10);
            ctx.lineTo(30, 30);

            ctx.moveTo(10, 30);
            ctx.lineTo(30, 10);
            ctx.stroke();
        });

    }

};
