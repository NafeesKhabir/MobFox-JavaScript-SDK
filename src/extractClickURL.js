var htmlparser = require("htmlparser");



module.exports = function(html,cb){
    var handler = new htmlparser.DefaultHandler(function (error, dom) {

        var nodes = dom,
            node = nodes.filter(function(n){
                return n.name === "html";
            })[0];

        if(node.name !== "body"){
            node = node.children.filter(function(n){
                return n.name === "body";
            })[0];
        }
        
        if(node.attribs && node.attribs.onclick){
            var m = node.attribs.onclick.match(/^gotourl\(\'(.*)\'\)$/);
            if(m) return cb(null,m[1]);
        }

        if(node.attribs && node.attribs["data-clickurl"]){
            return cb(null,node.attribs["data-clickurl"]);
        }

        cb();

    });
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(html);
    
};

