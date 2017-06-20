var render_response = function(width, height, json) {
    
    try {
        
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        
        var ifrm    = document.createElement('iframe');
        ifrm.id     = 'mobfoxFrame';

        document.body.appendChild(ifrm);

        //css
        ifrm.frameborder        = '0';
        ifrm.style.border       = 'none';
        ifrm.style.width        = width + 'px';
        ifrm.style.height       = height + 'px';
        ifrm.style.overflow     = 'hidden';
        ifrm.style.margin       = 'none';
        ifrm.setAttribute('scrolling', 'no');

        var html = getHTML(json); 

        if (html.indexOf("<html>") < 0) {
            html = ["<html><body style='margin:0px;padding:0px;'>", html, "</body></html>"].join("\n");
        } else {
            html = html + "<style>body{margin:0px;padding:0px}</style>";
        }

        ifrm.onload = function() {
            successLoad(window); 
        }

        var c = ifrm.contentWindow || ifrm.contentDocument.document || ifrm.contentDocument;
        
        c.document.open();
        c.document.write(html);
        c.document.close();
    }
    catch(e) {
        failLoad(window, e);
    }
}

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

var failLoad = function(window, reason) {
    try {
//        window.webkit.messageHandlers.mobfox.postMessage({fail:reason});
        console.log({fail:reason});
        return {fail:reason};
    } catch(e) {
//        console.log(e);
    }
    
};

//--------------------------------------

var successLoad = function(window) {
    try {
        document.body.style.backgroundColor = "#000000";
//        window.webkit.messageHandlers.mobfox.postMessage({success:''});
        console.log({success:''});
        return {success:''};
    } catch(e) {
//        console.log(e);
    }
    
};