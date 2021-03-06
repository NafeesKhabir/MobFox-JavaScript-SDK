var cleanAd = function(ad){
    
    try{
        var cleaned;

        var markupRegExp = new RegExp(/var markupB64\s*=\s*[\"\'](.*?)[\"\']/m),
            matchMarkup  = ad.match(markupRegExp);

        if(matchMarkup){
           ad = window.atob(matchMarkup[1].replace(/\s/g, '')); 
        }

        var audioCancel = "<script>window.navigator.vibrate=function(){ return true; }; window.AudioContext = null;</script>";

        ad = audioCancel + ad;

       /* if(ad.indexOf("<iframe") >=0){
            cleaned = ad;
        }*/
        if(ad.indexOf("</html>") > 0){
            cleaned = ad;
        }
        else if(ad.indexOf("</body>") > 0){
            cleaned = ["<html>",ad,"</html>"].join("\n");
        }
        else{
            cleaned = ["<html><body style='margin:0px;padding:0px;'>",ad,"</body></html>"].join("\n");
        }

        return cleaned;
    }
    catch(e){
        return null;
    }
};
//----------------------------------------------------------------
function addCloseButton(div,options,onclickCB){

    options = options || {};
    var button = document.createElement('canvas');

    div.appendChild(button);

    if(onclickCB){
        button.onclick = onclickCB;
    }
    else{
        button.onclick = function(){
            div.parentNode.removeChild(div); 
        };
    }

    button.style.position   = "absolute";
    button.style.width      =  (options.width || 40) + "px";
    button.style.height     =  (options.height || 40) + "px";
    button.style.top        =  (options.top || 5 ) + "px";
    button.style.right      =  (options.right || 10) + "px";   
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
}
//----------------------------------------------------------------
function createOnClickCallback(mobfoxClickURL,starboltClickURL){

    return function(){

        if(!starboltClickURL) return true;

        var anchor = document.createElement("a");
        anchor.href=  starboltClickURL || mobfoxClickURL;
        anchor.target = "_top";
        document.body.appendChild(anchor);
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        if(!starboltClickURL){
            anchor.dispatchEvent(evt);
            return;
        }

        var registerMobfoxClick = document.createElement("script");
        registerMobfoxClick.src = mobfoxClickURL;
        registerMobfoxClick.onload = registerMobfoxClick.onerror = function(){
            anchor.dispatchEvent(evt);
        };
        document.body.appendChild(registerMobfoxClick);
    };
}
//----------------------------------------------------------------

module.exports = {

    createBanner : function(ad,ad_id,confElement,mobfoxConfig,cb){

        cb = cb || function(){};

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

        if(confElement.parentNode && confElement.parentNode.tagName.toLowerCase() === "head"){
            confElement = document.body; 
            confElement.style.margin = "0px";
            confElement.appendChild(containerDiv);
        }
        else{
            confElement.parentNode.insertBefore(containerDiv,confElement);
        }

        var cleaned = cleanAd(ad.content);

        if(!cleaned){
            return cb("unable to clean ad.");
        }

        if(mobfoxConfig.noIFrame){
            var adDiv = document.createElement("div");

            adDiv.innerHTML = cleaned;
            adDiv.id = ad_id;
            adDiv.className = "mobfox_ad"; 
            adDiv.style.width= mobfoxConfig.width+"px";
            adDiv.style.height= mobfoxConfig.height+"px";

            containerDiv.appendChild(adDiv);

            adDiv.style.margin = "0px";
            adDiv.style.padding= "0px";
            adDiv.style.border= "none";   
            adDiv.style.overflow = "hidden";

            return;
        }

        iframe = document.createElement("iframe");
        iframe.id = ad_id;
        iframe.className = "mobfox_iframe"; 
        iframe.width= mobfoxConfig.width;
        iframe.height= mobfoxConfig.height;

        var sandbox = ["allow-top-navigation", "allow-scripts","allow-same-origin","allow-popups"];
        if(mobfoxConfig.disableJS){
           sandbox.splice(sandbox.indexOf("allow-scripts"),1); 
        }

        if(mobfoxConfig.disableOrigin){
           sandbox.splice(sandbox.indexOf("allow-same-origin"),1); 
        }

        iframe.sandbox = sandbox.join(" "); 

        if('srcdoc' in iframe){
            iframe.srcdoc = cleaned;    
            containerDiv.appendChild(iframe);
        }
        else{
            containerDiv.appendChild(iframe);
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(cleaned);
            iframe.contentWindow.document.close();
        }
 
        
        //iframe.style.pointerEvents = "none";

        

        iframe.style.margin = "0px";
        iframe.style.padding= "0px";
        iframe.style.border= "none";   

        iframe.scrolling = "no";
        iframe.style.overflow = "hidden";

        if(mobfoxConfig.close){
            containerDiv.style.width    = mobfoxConfig.width+"px";
            containerDiv.style.height   = mobfoxConfig.height+"px";
            containerDiv.style.position = "relative";
            addCloseButton(containerDiv,{width:20,height:20,top:5,right:5});
        }

        setTimeout(cb,1);
    },

    createInterstitial : function(ad,ad_id,confElement,mobfoxConfig,cb){
            
        cb = cb || function(){};

        if(mobfoxConfig.debug){
            mobfoxConfig.timeout = 500000;
        }
        if(confElement.parentNode && confElement.parentNode.tagName.toLowerCase() === "head"){
            confElement = document.body; 
        }

        var adBackground        = document.getElementById('mobfox_interstitial_background'),
            adContainer         = document.getElementById('mobfox_interstitial');

        if(adBackground){
            adBackground.parentNode.removeChild(adBackground);
        }

        if(adContainer){
            adContainer.parentNode.removeChild(adContainer);
        }

        adBackground= document.createElement('div'); 
        adBackground.id = "mobfox_interstitial_background";
        adBackground.style.width  = window.innerWidth + "px";
        adBackground.style.height = window.innerHeight + "px";
        adBackground.style.zIndex = "1000000";
        adBackground.style.backgroundColor = "#000";
        adBackground.style.opacity = "0.7";
        adBackground.style.position = "fixed";
        adBackground.style.left = "0px";
        adBackground.style.top = "0px";
        adBackground.style.margin = "0px";
        adBackground.style.padding= "0px";
        adBackground.style.border= "none";

        document.body.appendChild(adBackground);

        adContainer = document.createElement('div'); 
        adContainer.id = "mobfox_interstitial";
        adContainer.style.width  = window.innerWidth + "px";
        adContainer.style.height = window.innerHeight + "px";
        adContainer.style.zIndex = "1000001";
        adContainer.style.backgroundColor = "transparent";
        adContainer.style.position = "fixed";
        adContainer.style.left = "0px";
        adContainer.style.top = "0px";
        adContainer.style.margin = "0px";
        adContainer.style.padding= "0px";
        adContainer.style.border= "none";
        document.body.appendChild(adContainer);
        
        var cleaned = cleanAd(ad.content);

        if(!cleaned){
            return cb("unable to clean ad.");
        }
        var containerDiv = document.createElement("div");
        containerDiv.style.margin = "0px";
        containerDiv.style.padding= "0px";
        containerDiv.style.border= "none";
        containerDiv.style.cursor= "pointer";   
        containerDiv.id = "container_"+ad_id;

        adContainer.appendChild(containerDiv);

        var iframe = document.createElement('iframe');
        iframe.id = ad_id;
        iframe.className = "mobfox_iframe";
        iframe.width= mobfoxConfig.width;
        iframe.height= mobfoxConfig.height;

        if(mobfoxConfig.disableJS){
            iframe.sandbox="allow-top-navigation allow-same-origin allow-popups";
        }
        else{
            iframe.sandbox="allow-top-navigation allow-scripts allow-same-origin";
        }

        if('srcdoc' in iframe){
            iframe.srcdoc = cleaned; 
            containerDiv.appendChild(iframe);
        }
        else{
            containerDiv.appendChild(iframe);
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(cleaned);
            iframe.contentWindow.document.close();
        }

       // if(clickURL){
       //     iframe.style.pointerEvents = "none";
       // }

        containerDiv.appendChild(iframe);

        iframe.style.margin = "0px auto";
        iframe.style.padding= "0px";
        iframe.style.border= "none";
        iframe.style.display= "block";

        iframe.scrolling = "no";
        iframe.style.overflow = "hidden";

        addCloseButton(adContainer,{},
            function(){ 
                adBackground.parentNode.removeChild(adBackground);
                adContainer.parentNode.removeChild(adContainer);
            }
        );

        setTimeout(cb,1);

        setTimeout(function(){
           adBackground.parentNode.removeChild(adBackground); 
           adContainer.parentNode.removeChild(adContainer); 
        },mobfoxConfig.timeout || 16000);
    },
    createFloating : function(ad,ad_id,confElement,mobfoxConfig,cb){
        
        cb = cb || function(){};

        if(confElement.parentNode && confElement.parentNode.tagName.toLowerCase() === "head"){
            confElement = document.body; 
        }

        var adContainer = document.getElementById('mobfox_floating');
        if(adContainer){
            adContainer.parentNode.removeChild(iframe);
        }

        adContainer = document.createElement('div'); 
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
        
        var cleaned = cleanAd(ad.content);

        if(!cleaned){
            return cb("unable to clean ad.");
        }

        var containerDiv = document.createElement("div");

        containerDiv.style.margin = "0px";
        containerDiv.style.padding= "0px";
        containerDiv.style.border= "none";   
        containerDiv.style.cursor= "pointer";   
        containerDiv.id = "container_"+ad_id;

        adContainer.appendChild(containerDiv);

        var iframe = document.createElement('iframe');
        iframe.id = ad_id;
        iframe.className = "mobfox_iframe";
        iframe.width= mobfoxConfig.width;
        iframe.height= mobfoxConfig.height;

        //center it
        adContainer.style.left = ((window.innerWidth - parseInt(adContainer.style.width)) / 2) + "px";

        iframe.style.margin = "0px auto";
        iframe.style.padding= "0px";
        iframe.style.border= "none";
        iframe.style.display= "block";

        iframe.scrolling = "no";
        iframe.style.overflow = "hidden";
       // iframe.style.pointerEvents = "none";

        if(mobfoxConfig.closeButton === false) return;

        if(mobfoxConfig.disableJS){
            iframe.sandbox="allow-top-navigation allow-same-origin allow-popups";
        }
        else{
            iframe.sandbox="allow-top-navigation allow-scripts allow-same-origin";
        }

        if('srcdoc' in iframe){
            iframe.srcdoc = cleaned;    
            containerDiv.appendChild(iframe);
        }
        else{
            containerDiv.appendChild(iframe);
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(cleaned);
            iframe.contentWindow.document.close();
        }


        addCloseButton(adContainer,{width:20,height:20,top:5,right:5});

        setTimeout(cb,1);
    }

};
