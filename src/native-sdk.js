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
        s: mobfoxConfig.s || '80187188f458cfde788d961b6882fd53',
        i: mobfoxConfig.i || '2.122.29.194',
        u: mobfoxConfig.u || 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_0 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7A341 Safari/528.16',
        o_iosadvid: mobfoxConfig.o_iosadvid || '68753A44-4D6F-1226-9C60-0050E4C00067'
    };
    
    var publisher = mobfoxConfig.publisher;
    
    var shared = require('./templates/4shared.tmpl');
    
    var requestURL = 'http://my.mobfox.com/request.php';
    
    superagent
        .get(requestURL)
        .query(params)
        .end(function(err,res) {
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
        
            if (publisher == '4shared') {
                var banner = mustache.render(shared, obj);
            }
        
            container.innerHTML = banner;
        });
})();