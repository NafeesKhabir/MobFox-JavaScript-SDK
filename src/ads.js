var cleanAd = function(ad){
    
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

    console.log(cleaned);
    return cleaned;
};
//----------------------------------------------------------------
module.exports = {

    createBanner : function(ad,ad_id,confElement){
        var iframe = document.getElementById(ad_id);
        if(iframe){
            iframe.parentNode.removeChild(iframe);
        }

        iframe = document.createElement("iframe");
        iframe.id = ad_id;
        iframe.className = "mobfox_iframe"; 
        iframe.width= mobfoxConfig.width;
        iframe.height= mobfoxConfig.height;

        iframe.src = "data:text/html;charset=utf-8," + cleanAd(ad);

        confElement.parentNode.insertBefore(iframe,confElement);

        /*var iFrameDoc = document.getElementById(ad_id).contentWindow.document;
        iFrameDoc.write(cleanAd(ad));
        iFrameDoc.close();*/

        iframe.style.margin = "0px";
        iframe.style.padding= "0px";
        iframe.style.border= "none";   

        iframe.scrolling = "no";
        iframe.style.overflow = "hidden";
    },

    createInterstitial : function(ad,ad_id,confElement){
            
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

        var iframe = adContainer.contentWindow.document.createElement('iframe');
        iframe.id = ad_id;
        iframe.className = "mobfox_iframe";
        iframe.width= mobfoxConfig.width;
        iframe.height= mobfoxConfig.height;
        iframe.src = "data:text/html;charset=utf-8, "+escape(cleanAd(ad));
        adContainer.contentWindow.document.body.appendChild(iframe);

        /*var iFrameDoc = iframe.contentWindow.document;
        iFrameDoc.write(cleanAd(ad));
        iFrameDoc.close();*/


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
        },16000);
    }

};
