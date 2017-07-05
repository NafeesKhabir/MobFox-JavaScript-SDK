var superagent  = require("superagent"),
    once        = require("once");
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
var center = function(adspace_width, adspace_height) {
    var margin_left = (window.innerWidth  - adspace_width) / 2 + 'px';
    var margin_top  = (window.innerHeight - adspace_height) / 2 + 'px';
    return {
        "margin-left": margin_left,
        "margin-top": margin_top
    }
};
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

try {
    if (mobFoxParams.smart) {
        mobFoxParams.adspace_width = window.innerWidth;
        mobFoxParams.adspace_height = window.innerHeight;
        var size = getClosestPoint(DEMAND_SIZES, {width: mobFoxParams.adspace_width, height: mobFoxParams.adspace_height});
        if (mobFoxParams.adspace_width / size.width < 1.5 && mobFoxParams.adspace_height / size.height < 1.5) {
            mobFoxParams.adspace_width  = size.width;
            mobFoxParams.adspace_height = size.height;
        }
    }
} catch(e) {
    failLoad({e5:e});
    return;
}

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
            ifrm.frameborder            = "0";
            ifrm.style.border           = "none";
            ifrm.style.width            = mobFoxParams.adspace_width + "px";
            ifrm.style.height           = mobFoxParams.adspace_height + "px";
            ifrm.style.backgroundColor  = '#000000';
            ifrm.style.overflow         = "hidden";
            ifrm.style.overflow         = "hidden";
            ifrm.style.margin           = "none";
            ifrm.style.scrolling        = "no";
        
            var margins = center(mobFoxParams.adspace_width, mobFoxParams.adspace_height);

            var markupRegExp = new RegExp(/var markupB64\s*=\s*[\"\'](.*?)[\"\']/m),
                matchMarkup  = json.request.htmlString.match(markupRegExp);

            if (matchMarkup) {
                html = window.atob(matchMarkup[1]) + "<style>body{margin-top:"+margins["margin-top"]+";margin-left:"+margins["margin-left"]+";}</style>";
            }

            ifrm.onload = function(){
                setTimeout( function() { window.location = 'mopub://finishLoad'; }, 0 );
                if(typeof(_track) === "function"){
                    _track();
                }
            };

            var c = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
            
            c.document.open();
            c.document.write(html);
            c.document.close();
            
        }));
//--------------------------------------