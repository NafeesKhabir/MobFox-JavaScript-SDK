//var htmlparser  = require("htmlparser");

module.exports = function(window,refE,passback,options,cb){

    var iframe= window.document.createElement("iframe");

    iframe.onload = function(){
        if(iframe.passbackLoaded) return;
        var iframeWin= (iframe.contentWindow) ? iframe.contentWindow : (iframe.contentDocument.document) ? iframe.contentDocument.document : iframe.contentDocument;
        iframeWin.document.open();
        iframeWin.document.write(decodeURIComponent(passback));
        iframeWin.document.close();
        iframe.sandbox="allow-top-navigation allow-popups allow-scripts";
        iframe.passbackLoaded = true;
    };

    if(options.confID){
        refE = options.confID.match(/^\d+$/) ? document.querySelector("#mobfoxConf_"+options.confID) : document.querySelector("#"+options.confID);
        if(refE.parentNode === document.head){
            document.body.appendChild(iframe);
        }
        else{
            refE.parentNode.insertBefore(iframe,refE);
        }
    }
    else if(refE){
        refE.parentNode.insertBefore(iframe,refE);
    }
    else{
        window.document.body.appendChild(iframe);
    }

    iframe.style.width = options.width+"px";
    iframe.style.height= options.height+"px";
    iframe.style.margin = "0px";
    iframe.style.border= "none";
    iframe.style.overflowY =  "hidden";
    iframe.frameBorder = 0;
    iframe.seamless="seamless";
    iframe.scrolling = "no";
};

