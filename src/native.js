var superagent  = require("superagent"),
    async       = require("async"),
    once        = require("once");

//--------------------------------------
mobFoxParams.u          = navigator.userAgent;
mobFoxParams.r_resp     = "json";
mobFoxParams.rt         = "api-fetchip";
mobFoxParams.r_type     = "native";
mobFoxParams.n_ver      = "1.1";

superagent
        .get("http://my.mobfox.com/request.php")
        .timeout(3000)
        .query(mobFoxParams)
        .end(once(function(err,resp){
            
            if(err || resp.error || !resp.body || resp.body.error){
                if(typeof(mobFoxParams.onLoad) === "function"){ 
                    var errMsg = err || resp.error || !resp.body || resp.body.error;
                    mobFoxParams.onLoad(err);
                }
                return;
            }

            var json = resp.body;
            async.each(
                json.native.imptrackers,
                function(imp,cb){
                    superagent.get(imp).end(cb);
                },
                function(err){
                    if(typeof(mobFoxParams.onLoad) === "function"){
                        mobFoxParams.onLoad(null,json);
                    }
                }); 
        }));
//--------------------------------------
