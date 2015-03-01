//var htmlparser  = require("htmlparser");

module.exports = function(window,refE,passback,options,cb){

    var iframe= window.document.createElement("iframe");
    
    iframe.src = ["data:text/html;charset=utf-8," ,"<style>body{margin:0;}</style>",decodeURIComponent(passback)].join("");

    if(options.confID){
        refE = document.querySelector("#mobfoxConf_"+options.confID);
        if(refE.parentNode === document.head){
            document.body.appendChild(iframe);
        }
        else{
            refE.parentNode.insertBefore(iframe,refE);
        }
    }
    else if(refE){
        refE.parentNode.insertBefore(iframe,refE);
    }
    else{
        window.document.body.appendChild(iframe);
    }

    iframe.style.width = options.width+"px";
    iframe.style.height= options.height+"px";
    iframe.style.margin = "0px";
    iframe.style.border= "none";
    iframe.style.overflowY =  "hidden";
    iframe.frameBorder = 0;
    iframe.seamless="seamless";
    iframe.scrolling = "no";
};

