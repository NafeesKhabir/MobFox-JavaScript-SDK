var Qs      = require('qs'),
    confE   = document.getElementById("mobfoxConfig"),
    adVar   = "adResponse_" + String(Math.random()).slice(2),
    script  = document.createElement("script");

confE.parentNode.insertBefore(script,confE);

var params = {
    r_type  : mobfoxConfig.type,
    u       : window.navigator.userAgent,
    //i : "8.8.8.8",
    s       : mobfoxConfig.publisherID,
    m       : 'test',
    rt      : 'javascript',
    v       : '3.0',
    'adspace.width' : mobfoxConfig.width,
    'adspace.height' : mobfoxConfig.height,
    jsvar : adVar
};

script.src = 'http://my.mobfox.com/request.php?' + Qs.stringify(params);

script.onload = function(){

    var iframe = document.createElement("iframe");
    iframe.width= mobfoxConfig.width;
    iframe.height= mobfoxConfig.height;
    iframe.src= ["data:text/html;charset=utf-8,","<html>",window[adVar][0].content,"</html>"].join("\n");
    //iframe.innerHTML= ["<html>",window[adVar][0].content,"</html>"].join("\n");
    confE.parentNode.insertBefore(iframe,confE);
    iframe.style.margin = "0px";
    iframe.style.padding= "0px";
    iframe.style.border= "none";
};
