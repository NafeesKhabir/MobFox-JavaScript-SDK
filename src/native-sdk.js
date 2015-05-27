(function(){
    URL = require('./lite-url').liteURL,
    curScript       = document.currentScript || (function() {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    
    var superagent = require('superagent');
    var mustache = require('mustache');
    
    var container = curScript.parentNode;
    
    var mobfoxConfig = URL(curScript.src).params;
    
    var params = {
        rt: mobfoxConfig.rt || 'api',
        r_type: mobfoxConfig.r_type || 'native',
        r_resp: mobfoxConfig.r_resp || 'json',
        n_img: mobfoxConfig.n_img || 'icon',
        n_txt: mobfoxConfig.n_txt || 'headline',
        s: mobfoxConfig.invh,
        i: mobfoxConfig.i || '8.8.8.8',
        u: window.navigator.userAgent
    };
    
    var height = mobfoxConfig.height;
    
    var native_50 = require('./templates/native_50.tmpl');
    var native_100 = require('./templates/native_100.tmpl');
    
    var requestURL = 'http://my.mobfox.com/request.php';
    
    superagent
        .get(requestURL)
        .query(params)
        .end(function(err,res) {
        
            if (!res.body || err) {
                container.parentNode.removeChild(container);
                return;
            }
        
            var response = res.body;
        
            var obj = {
                data: {
                    icon: response.imageassets.icon.url,
                    title: response.textassets.headline,
                    desc: response.textassets.description,
                    cta: response.textassets.cta || 'Install Now',
                    click_url: response.click_url,
                    trackers: []
                }
            };
        
            response.trackers.forEach(function(o) {
                obj.data.trackers.push(o);
            });
        
            if (height == '50') {
                var banner = mustache.render(native_50, obj);
            }
        
            if (height == '100') {
                var banner = mustache.render(native_100, obj);
            }
        
            container.innerHTML = banner;
        });
})();