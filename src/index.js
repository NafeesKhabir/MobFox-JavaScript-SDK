var Qs = require('qs');
/*
var superagent = require('superagent');


superagent
    .get('http://my.mobfox.com/request.php?rt=api&s=6979b24be367c49693913e11d75428e7&v=2.0&u=Mozilla%2F5.0+%28iPhone%3B+U%3B+CPU+like+Mac+OS+X%3B+en%29+AppleWebKit%2F420%2B+%28KHTML%2C+like+Gecko%29+Version%2F3.0+Mobile%2F1A543a+Safari%2F419.3&i=178.190.64.146&m=live&o=2b6f0cc904d137be2e1730235f5664094b831186&o_mcsha1=82a53f1222f8781a5063a773231d4a7ee41bdd6f&o_mcmd5=3691308f2a4c2f6983f2880d32e29c84&jsvar')
    .query({""})
<div id='" + id + "'></div>
    .end(function(err,res){
        console.log(err);
        console.log(res);
    });
*/

var adVar = "adResponse_" + String(Math.random()).slice(2) ;
var script = document.createElement("script");
document.body.appendChild(script);

var params = {
    r_type : 'banner',
    u : window.navigator.userAgent,
    //i : "8.8.8.8",
    s: 'fe96717d9875b9da4339ea5367eff1ec',
    m : 'test',
    rt : 'javascript',
    v : '3.0',
    'adspace.width' : 320,
    'adspace.height' : 50,
    jsvar : adVar
};

script.src = 'http://my.mobfox.com/request.php?' + Qs.stringify(params);

script.onload = function(){

    var iframe = document.createElement("iframe");
    iframe.width= 320;
    iframe.height= 50;
    iframe.src= ["data:text/html;charset=utf-8,","<html>",window[adVar][0].content,"</html>"].join("\n");
    //iframe.innerHTML= ["<html>",window[adVar][0].content,"</html>"].join("\n");
    document.body.appendChild(iframe);
    iframe.style.margin = "0px";
    iframe.style.padding= "0px";
    iframe.style.border= "none";
};
