(function(){

    var Qs              = require('./query-string'),
        superagent      = require('superagent'),
        mustache        = require('mustache'),
        URL             = require('./lite-url').liteURL,
        templates       = {
            "article"   : require("./templates/article.html"),
            "image"     : require("./templates/image.html"),
            "landscape" : require("./templates/landscape.html")
        },
        curScript       = document.currentScript || (function() {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })(),
        mobfoxConfig = URL(curScript.src).params,
        options = [
                "r_type",
                "r_resp",
                "n_img",
                "n_txt",
                "n_type",
                "s",
                "u",
                "i",
                "p",
                "o_androidid",
                "o_androidimei",
                "o_iosadvid",
                "o_andadvid",
                "v",
                "longitude",
                "latitude",
                "h[header-name]",
                "demo_gender",
                "demo_keywords",
                "demo_age",
                "u_wv",
                "u_br",
                "s_subid",
                "sub_name",
                "sub_domain",
                "sub_storeurl",
                "sub_bundle_id",
                "r_floor"
        ],    
        params = {
                r_type                  : 'native',
                r_resp                  : 'json',
                u                       : window.navigator.userAgent,
                s                       : mobfoxConfig.invh,
                p                       : window.location.href,
                v                       : '3.0',
                'h[Referer]'            : mobfoxConfig.referrer || document.referrer,
                n_img                   :'icon',
                n_txt                   :'headline',
                i                       : '2.122.29.194',
                o_iosadvid              : '68753A44-4D6F-1226-9C60-0050E4C00067'
        };
   
        //copy configs to params
        options.forEach(function(o){
            if(typeof(mobfoxConfig[o]) !== 'undefined'){
                params[o] = mobfoxConfig[o];
            }
        });


        if(params.referrer && !params.sub_domain && params.referrer.indexOf("http")===0){
            params.sub_domain = URL(params.referrer).hostname;
        }

        superagent
            .get("http://my.mobfox.com/request.php")
            .query(params)
            .end(function(err,res){
                var error = err || res.error;
                if(error){
                    return console.log("MobFox SDK Error: "+error);
                }

                var data        = res.body,
                    template    = mobfoxConfig.template ? templates[mobfoxConfig.template] : template.article;

                if(!data){
                    return console.log("MobFox SDK: no ad returned");
                }

                data.impressions = data.trackers.filter(function(t){
                    return t.type === "impression";
                });

                data.css = {"heading":{},"cta":{},"info":{}};
                data.css.width  = mobfoxConfig.width;
                data.css.height = mobfoxConfig.height;
                data.css.font   = mobfoxConfig.font || "Sans-Serif";

                data.css.bg = mobfoxConfig.bg || "#eee";
                data.css.fg = mobfoxConfig.fg || "#000";
                data.css.heading.fg = mobfoxConfig.headingFg || "#ffa500";

                data.css.cta.fg = mobfoxConfig.ctaFg || "#fff";
                data.css.cta.bg = mobfoxConfig.ctaBg || "#777";

                data.css.info.fg = mobfoxConfig.infoFg || "#999";

                var html    = mustache.render(template,data),
                    iframe  = document.createElement("iframe");

                if(curScript.parentNode && curScript.parentNode.tagName.toLowerCase() === "head"){
                    document.body.appendChild(iframe);
                }
                else{
                    curScript.parentNode.insertBefore(iframe,curScript.nextSibling); 
                }

                iframe.src = "data:text/html;charset=utf-8," + escape(html);
                iframe.style.width  = data.css.width;
                iframe.style.height = data.css.height;
                iframe.style.border = "none";
                
            });

})();
