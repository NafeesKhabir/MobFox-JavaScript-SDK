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
var createIFrame = function(width,height,json){
    
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

window.renderAd = once(function(adspace_width,adspace_height,json){

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
            createIFrame(adspace_width,adspace_height,json); 
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

