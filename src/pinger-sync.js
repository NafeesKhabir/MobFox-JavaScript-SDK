var once        = require("once");

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

var timeout     = false,
    finished    = false;

var mobFoxCall = once(function(){

    window.setTimeout(function(){
        timeout = true;
        if(finished) return;
        failLoad();
    },3000);

    var request = new XMLHttpRequest();

    try{
        var paramsArr = [];
        Object.keys(mobFoxParams).forEach(function(k){
            paramsArr.push([k,encodeURIComponent(mobFoxParams[k])].join("="));
        });
        var params = paramsArr.join("&");

        request.open('GET', 'http://my.mobfox.com/request.php?'+params, false);  // `false` makes the request synchronous
        request.send(null);

        if (request.status !== 200 || !request.responseText || request.responseText.length === 0) {
            finished = true;
            return failLoad();
        }

        var json;
        try{
            json = JSON.parse(request.responseText);
        }
        catch(e){
            finished = true;
            return failLoad();
        }

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

});

mobFoxCall();
/*
var mobFoxCall = once(function(){

    var timeout     = false,
        finished    = false;

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

                    var json    = resp.body,
                        html    = json.request.htmlString;

                    var ifrm = document.getElementById("mobfoxFrame");
                    if(!ifrm){
                        ifrm = document.createElement('iframe');
                        ifrm.id = "mobfoxFrame";
                        document.body.appendChild(ifrm);
                    }

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
                        html = window.atob(matchMarkup[1]) + "<style>body{margin:0;}</style>";
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
                
            }));
});

*/
/*if(document.currentScript.parentNode.tagName.toLowerCase() === "head"){
    document.addEventListener("DOMContentLoaded",function(){
        var ifrm = document.createElement('iframe');
        ifrm.id = "mobfoxFrame";
        document.body.appendChild(ifrm);
        mobFoxCall();
    }); 
}
else{*/
//}
//--------------------------------------

