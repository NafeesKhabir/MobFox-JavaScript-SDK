var htmlparser = require("htmlparser2");

module.exports = function(html,cb){

    var parser = new htmlparser.Parser({
        onopentag: function(name, attribs){
            if(name === "body"){
                if(attribs.onclick){
                    var m = attribs.onclick.match(/^gotourl\(\'(.*)\'\)$/);
                    if(m) return cb(null,m[1]);
                }

                if(attribs["data-clickurl"]){
                    return cb(null,attribs["data-clickurl"]);
                }
                cb();
            }

        }
    }, {decodeEntities: true});
    parser.write(html);
    parser.end();
};

