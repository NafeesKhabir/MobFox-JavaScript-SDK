var once        = require("once"),
    curScript   = document.currentScript;

//--------------------------------------
var timeout     = false,
    finished    = false;
//--------------------------------------
var failLoad = function(reason) {
    if (typeof(mobFoxParams.onFail)==="function") {
        mobFoxParams.onFail(reason);
    }
};
//--------------------------------------
var successLoad = function() {
    if (typeof(mobFoxParams.onSuccess)==="function") {
        mobFoxParams.onSuccess();
    }
};
//--------------------------------------
var onClose = function(){
    if (typeof(mobFoxParams.onClose)==="function") {
        mobFoxParams.onClose();
    }
};
//--------------------------------------
var getHTML = function(json) {

    var html            = json.request.htmlString,
        markupRegExp    = new RegExp(/var markupB64\s*=\s*[\"\'](.*?)[\"\']/m),
        matchMarkup     = json.request.htmlString.match(markupRegExp);

    if (matchMarkup) {
        html = window.atob(matchMarkup[1]);
    }

    return html;
};
//--------------------------------------
var createIFrame = function(width,height,json,isCloseButton){
    
    try{
        var ifrm = document.createElement('iframe');
        ifrm.id = "mobfoxFrame";

        if(curScript && curScript.parentNode.tagName.toLowerCase() !== "head"){
            curScript.parentNode.appendChild(ifrm);     
        }
        else{
            document.body.appendChild(ifrm);
        }

        //css
        ifrm.frameborder = "0";
        ifrm.style.border    = "none";
        ifrm.style.width     = width + "px";
        ifrm.style.height    = height + "px";
        ifrm.style.overflow  = "hidden";
        ifrm.style.margin    = "none";
        ifrm.setAttribute("scrolling","no");

        if(isCloseButton){
            var close = window.document.createElement("div");
            close.id                        = "close";
            close.style.backgroundImage     = "url(button_close_55x55.png)";
            close.style.backgroundSize      = "55px 55px";
            close.style.width               = "55px";
            close.style.height              = "55px";
            close.style.position            = "absolute";
            close.style.top                 = "0px";
            close.style.right               = "0px";
            document.body.appendChild(close);        
            close.addEventListener("click",function(e){
                e.stopPropagation();
                onClose();
                return false;
            },false);
        }


        var html = getHTML(json); 

        if(html.indexOf("<html>") < 0){
            html = ["<html><body style='margin:0px;padding:0px;'>",html,"</body></html>"].join("\n");
        }
        else{
            html = html + "<style>body{margin:0px;padding:0px}</style>";
        }

        ifrm.onload = once(function(){
            if(timeout) return;
            finished = true; 
            successLoad(); 
        });

        var c = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
        
        c.document.open();
        c.document.write(html);
        c.document.close();
    }
    catch(e) {
        finished = true; 
        failLoad({e2:e});
    }
};

//--------------------------------------

window.renderAd = once(function(adspace_width,adspace_height,json,isCloseButton){

    window.setTimeout(function(){
        timeout = true;
        if (finished) return;
        failLoad("timeout");
    },3000);
    
   
    try {
        
        if (typeof(json) === 'string') {
            json = JSON.parse(json);
        }

        //if (document.body) {
            document.body.style.backgroundColor = "#000000";
            createIFrame(adspace_width,adspace_height,json,isCloseButton); 
        /*}
        else{
            document.addEventListener("DOMContentLoaded",function(){
                document.body.style.backgroundColor = "#000000";
                createIFrame(adspace_width,adspace_height,json);
            });
        }*/
    }
    catch(e) {
        finished = true; 
        failLoad({e4:e});
    }
                
});
//--------------------------------------

