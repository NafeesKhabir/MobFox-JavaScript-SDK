var htmlparser  = require("htmlparser");

module.exports = function(window,refE,passback,cb){
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
        /*try{
            if(dom[0].name === 'iframe'){
                var src = dom[0].attribs.src;
                return cb(null,url.parse(src,true).query.overrideClickURL);
            }

            var nodes = dom,
                node = nodes.filter(function(n){
                    return n.name === "html";
                })[0];

            if(node && node.name !== "body"){
                node = node.children.filter(function(n){
                    return n.name === "body";
                })[0];
            }
            
            if(node && node.attribs && node.attribs.onclick){
                var m = node.attribs.onclick.match(/^gotourl\(\'(.*)\'\)$/);
                if(m) return cb(null,m[1]);
            }

            if(node && node.attribs && node.attribs["data-clickurl"]){
                return cb(null,node.attribs["data-clickurl"]);
            }

            cb();
        }
        catch(e){
            cb(e);
        }*/
    });
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(passback);
    
};

