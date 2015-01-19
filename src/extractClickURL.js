var url         = require('url'),
    htmlparser  = require("htmlparser");



module.exports = function(html,cb){
    var handler = new htmlparser.DefaultHandler(function (error, dom) {

        try{
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
        }
    });
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(html);
    
};

