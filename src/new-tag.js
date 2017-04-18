var superagent  = require("superagent"),
    once        = require("once");

//--------------------------------------
var timeout     = false,
    finished    = false;
//--------------------------------------
var failLoad = function(){
    if(typeof(mobFoxParams.onFail)==="function"){
        mobFoxParams.onFail();
    }
};
//--------------------------------------
var successLoad = function(){
    if(typeof(mobFoxParams.onSuccess)==="function"){
        mobFoxParams.onSuccess();
    }
};
//--------------------------------------
var createIFrame = function(json){
    
    try{
        var html = json.request.htmlString;
        var ifrm = document.createElement('iframe');
        ifrm.id = "mobfoxFrame";
        document.body.appendChild(ifrm);

        //css
        ifrm.frameborder = "0";
        ifrm.style.border    = "none";
        ifrm.style.width     = mobFoxParams.adspace_width + "px";
        ifrm.style.height    = mobFoxParams.adspace_height + "px";
        ifrm.style.overflow  = "hidden";
        ifrm.style.overflow  = "hidden";
        ifrm.style.margin    = "none";
        ifrm.style.scrolling = "no";

        var markupRegExp = new RegExp(/var markupB64\s*=\s*[\"\'](.*?)[\"\']/m),
            matchMarkup  = json.request.htmlString.match(markupRegExp);

        if(matchMarkup){
            html = window.atob(matchMarkup[1]);
            if(html.indexOf("<html>") < 0){
                html = ["<html><body style='margin:0px;padding:0px;'>",html,"</body></html>"].join("\n");
            }
            else{
                html = html + "<style>body{margin:0px;padding:0px}</style>";
            }
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
    catch(e){
        finished = true; 
        failLoad();
    }
};

//--------------------------------------

mobFoxParams.u          = navigator.userAgent;
mobFoxParams.r_resp     = "json";
mobFoxParams.rt         = "api-fetchip";
mobFoxParams.r_type     = "banner";

var mobFoxCall = once(function(){

    window.setTimeout(function(){
        timeout = true;
        if(finished) return;
        failLoad();
    },3000);

    superagent
            .get("http://my.mobfox.com/request.php")
            .timeout(2500)
            .query(mobFoxParams)
            .end(once(function(err,resp){
                if(timeout) return;
                try{
                    if(err || resp.error || !resp.body || resp.body.error){
                        finished = true;
                        return failLoad();
                    }

                    var json    = resp.body;
                    if(document.body){
                        createIFrame(json); 
                    }
                    else{
                        document.addEventListener("DOMContentLoaded",function(){
                            createIFrame(json);
                        });
                    }
                }
                catch(e){
                    finished = true; 
                    failLoad();
                }
                
            }));
});

//--------------------------------------

mobFoxCall();
