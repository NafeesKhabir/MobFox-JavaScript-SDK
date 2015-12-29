(function(){

    var Qs              = require('./query-string'),
        superagent      = require('superagent'),
        mustache        = require('mustache'),
        URL             = require('./lite-url').liteURL,
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

        if(mobfoxConfig.referrer && !params.sub_domain && mobfoxConfig.referrer.indexOf("http")===0){
            params.sub_domain = URL(mobfoxConfig.referrer).hostname;
        }
        else if(mobfoxConfig.referrer && !params.sub_domain && mobfoxConfig.referrer.match(/^(\w+\.){0,2}\w+\.\w+$/)){
            params.sub_domain = mobfoxConfig.referrer;
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
                    template    = mobfoxConfig.template,
                    selector    = mobfoxConfig.selector,
                    index       = parseInt(mobfoxConfig.index);

                var tag = mustache.render(template,data);

                var readyStateCheckInterval = setInterval(function() {
                    if (document.readyState === "interactive" || document.readyState === "complete") {
                        clearInterval(readyStateCheckInterval);
                        
                        var nodes = document.querySelectorAll(selector); 
                        var e = nodes.item(index);
                        e.insertAdjacentHTML('beforebegin', tag);  
                    }
                }, 10); 


            });

})();
