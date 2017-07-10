var superagent  = require("superagent"),
    once        = require("once"),
    curScript   = document.currentScript;

//--------------------------------------
var DEMAND_SIZES = {
	"300x50": {
		"width": 300,
		"height": 50
	},
	"320x50": {
		"width": 320,
		"height": 50
	},
	"300x250": {
		"width": 300,
		"height": 250
	},
	"320x480": {
		"width": 320,
		"height": 480
	},
	"480x320": {
		"width": 480,
		"height": 320
	},
	"728x90": {
		"width": 728,
		"height": 90
	},
	"90x728": {
		"width": 90,
		"height": 728
	},
	"600x1024": {
		"width": 600,
		"height": 1024
	},
	"1024x600": {
		"width": 1024,
		"height": 600
	},
	"768x1024": {
		"width": 768,
		"height": 1024
	},
	"1024x768": {
		"width": 1024,
		"height": 768
	}
};
//--------------------------------------
var getDist = function(point1, point2) {
    var a = point1.width    - point2.width;
    var b = point1.height   - point2.height;
    return Math.sqrt( a*a + b*b );
};
//--------------------------------------
var getClosestPoint = function(points, point) {
    var min     = -1;
    var closest = {};
    for (key in points) {
        var POINT = points[key];
        if (min == -1) {
            min     = getDist(POINT, point);
            closest = POINT;
            continue;
        }
        if (getDist(POINT, point) < min) {
            if (POINT.width <= point.width && POINT.height <= point.height) {
                min     = getDist(POINT, point);
                closest = POINT;
            }
        }
    }
    return closest;
};
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
var createDiv = function(json){

    try {

        var div = document.createElement('div');
        div.id = "mobfoxDiv";

        if (curScript && curScript.parentNode.tagName.toLowerCase() !== "head"){
            curScript.parentNode.appendChild(div);     
        }
        else {
            document.body.appendChild(div);
        }

        //css
        div.style.border        = "none";
        if (mobFoxParams.smart) {
            div.style.width             = window.innerWidth + "px";
            div.style.height            = window.innerHeight + "px";
            div.style.backgroundColor   = "#000000";
        } else {
            div.style.width             = mobFoxParams.adspace_width + "px";
            div.style.height            = mobFoxParams.adspace_height + "px";
        }
        div.style.overflow      = "hidden";
        div.style.margin        = "0px";
        div.style.padding       = "0px";
        div.style.display       = "inline-block";
        
        div.style.display           = "flex";
        div.style.alignItems        = "center";
        div.style.justifyContent    = "center";

        var html = getHTML(json); 
        div.innerHTML = '<div>'+html+'</div>';

        finished = true; 
        successLoad(); 

    }
    catch(e) {
        finished = true;
        failLoad({e1:e});
    }

};
//--------------------------------------
var createIFrame = function(json){
    
    try{
        var ifrm = document.createElement('iframe');
        ifrm.id = "mobfoxFrame";

        if (curScript && curScript.parentNode.tagName.toLowerCase() !== "head") {
            curScript.parentNode.appendChild(ifrm);     
        }
        else {
            document.body.appendChild(ifrm);
        }

        //css
        ifrm.frameborder = "0";
        ifrm.style.border    = "none";
        if (mobFoxParams.smart) {
            ifrm.style.width             = window.innerWidth + "px";
            ifrm.style.height            = window.innerHeight + "px";
            ifrm.style.backgroundColor   = "#000000";
        } else {
            ifrm.style.width             = mobFoxParams.adspace_width + "px";
            ifrm.style.height            = mobFoxParams.adspace_height + "px";
        }
        ifrm.style.overflow  = "hidden";
        ifrm.style.margin    = "none";
        ifrm.setAttribute("scrolling","no");

        var html = getHTML(json); 

        if(html.indexOf("<html>") < 0){
            html = ["<html><body style='margin:0px;padding:0px;display:flex;align-items:center;justify-content:center;'>","<div>",html,"</div>","</body></html>"].join("\n");
        }
        else{
            html = html + "<style>body{margin:0px;padding:0px;display:flex;align-items:center;justify-content:center}</style>";
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
        console.log(e);
        finished = true; 
        failLoad({e2:e});
    }
};

//--------------------------------------

mobFoxParams.u          = navigator.userAgent;
mobFoxParams.r_resp     = "json";
mobFoxParams.rt         = "api-fetchip";
mobFoxParams.r_type     = "banner";

if (mobFoxParams.smart) {
    mobFoxParams.adspace_width = window.innerWidth;
    mobFoxParams.adspace_height = window.innerHeight;
    var size = getClosestPoint(DEMAND_SIZES, {width: mobFoxParams.adspace_width, height: mobFoxParams.adspace_height});
    if (mobFoxParams.adspace_width / size.width < 1.5 && mobFoxParams.adspace_height / size.height < 1.5) {
        mobFoxParams.adspace_width  = size.width;
        mobFoxParams.adspace_height = size.height;
    }
}

var url = "http://my.mobfox.com/request.php";

try {
    if (mobFoxParams.imp_secure == 1) {
        url = "https://my.mobfox.com/request.php";
    }
} catch(e) {}

var mobFoxCall = once(function(){

    window.setTimeout(function(){
        timeout = true;
        if (finished) return;
        failLoad("timeout");
    },3000);
    
    superagent
            .get(url)
            .timeout(2500)
            .query(mobFoxParams)
            .end(once(function(err,resp) {
        
                if (timeout) return;
                try {
                    
                    var problem = err || resp.error || !resp.body || resp.body.error;
                    if (problem) {
                        finished = true;
                        return failLoad({e3:problem});
                    }

                    var json = resp.body;

                    if (document.body) {
                        if (mobFoxParams.noIFrame) createDiv(json);
                        else createIFrame(json); 
                    }
                    else{
                        document.addEventListener("DOMContentLoaded",function(){
                            if (mobFoxParams.noIFrame) createDiv(json);
                            else createIFrame(json); 
                        });
                    }
                }
                catch(e) {
                    finished = true; 
                    failLoad({e4:e});
                }
                
            }));
});

//--------------------------------------

mobFoxCall();
