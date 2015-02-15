//var htmlparser  = require("htmlparser");

module.exports = function(window,refE,passback,options,cb){

    var iframe= window.document.createElement("iframe");
    
    iframe.src = ["data:text/html;charset=utf-8," ,"<style>body{margin:0;}</style>",passback].join("");

    if(refE){
        refE.parentNode.insertBefore(iframe,refE);
    }
    else{
        window.document.body.appendChild(iframe);
    }

    iframe.style.width = options.width+"px";
    iframe.style.height= options.height+"px";
    iframe.style.margin = "0px";
    iframe.style.border= "none";
    iframe.frameBorder = 0;
    iframe.scrolling = 0;
    /*
    var handler = new htmlparser.DefaultHandler(function (error, dom) {

        dom.filter(function(node){
                return node.type==="script";
            })
            .forEach(function(node){

                var script = window.document.createElement("script");

                if(node.attribs){

                    if(node.attribs.type){
                        script.type = node.attribs.type;
                    }

                    if(node.attribs.src){
                        script.src = node.attribs.src;
                    }

                    if(node.children && node.children[0].data){
                        script.innerHTML = node.children[0].data;
                    }

                    if(refE){
                        refE.parentNode.insertBefore(script,refE);
                    }
                    else{
                        window.document.body.appendChild(script);
                    }
                }

            });

            cb();
        
    });
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(passback);
    */
    
};

