var superagent  = require("superagent"),
    once        = require("once");

//--------------------------------------
var failLoad = function(){
    loaded=true;
    window.location="mopub://failLoad"; 
};
//--------------------------------------

mobFoxParams.u          = navigator.userAgent;
mobFoxParams.r_resp     = "json";
mobFoxParams.rt         = "api-fetchip";
mobFoxParams.r_type     = "banner";

//mopub parameters
if(typeof(window.mopubFinishLoad) === "function"){
    window.mopubFinishLoad = null;
}

if(typeof(window.trackImpressionHelper) === "function"){
    var _track = window.trackImpressionHelper;
    window.trackImpressionHelper = null;
}

window.htmlWillCallFinishLoad =true;

superagent
        .get("http://my.mobfox.com/request.php")
        .timeout(3000)
        .query(mobFoxParams)
        .end(once(function(err,resp){
            if(err || resp.error || !resp.body || resp.body.error){
                return failLoad();
            }

            var json    = resp.body,
                html    = json.request.htmlString;

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

            var c = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
            c.document.open();
            c.document.write(html);
            c.document.close();
            setTimeout( function() { window.location = 'mopub://finishLoad'; }, 0 );
            if(typeof(_track) === "function"){
                _track();
            }
        }));
//--------------------------------------
