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
        iframe.src= ["data:text/html;charset=utf-8,","<html>",ad,"</html>"].join("\n");
        confElement.parentNode.insertBefore(iframe,confElement);
        iframe.style.margin = "0px";
        iframe.style.padding= "0px";
        iframe.style.border= "none";   
    },

    createInterstitial : function(ad,ad_id,confElement){
            
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

        var button = adContainer.contentWindow.document.createElement('canvas');
        adContainer.contentWindow.document.body.appendChild(button);

        button.innerHTML = "X";
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

        var ctx = button.getContext('2d');
        ctx.rect(0,0,40,40);
        ctx.fillStyle="#fff";
        ctx.fill();

        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;

        ctx.rect(0,0,40,40);
        ctx.stroke();

        ctx.lineWidth = 10;
        ctx.beginPath();

        ctx.moveTo(8, 8);
        ctx.lineTo(32, 32);

        ctx.moveTo(8, 32);
        ctx.lineTo(32, 8);
        ctx.stroke();

        setTimeout(function(){
           adContainer.parentNode.removeChild(adContainer); 
        },16000);
    }

};
