(function(){
    var script = document.currentScript || (function() {
            var scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })(),
        url     = script.src,
        hash    = url.split("?")[1],
        keyVals = hash.split("&"),
        params  = {};

    keyVals.forEach(function(kv){
        var k = kv.split("=")[0],
            v = decodeURIComponent(kv.split("=")[1]);

        if(v.match(/^\d+$/)){
            v = parseInt(v);
        }

        if(v === "true") v = true;
        if(v === "false") v = false;

        params[k] = v;
    });


    var mobfoxConfig = {
        width:          params.width,
        height:         params.height,
        publicationID:  params.pid,
        debug:          params.debug,
        type:           params.type
    };


    if(params.passback){
        mobfoxConfig.passback = params.passback.replace(/\\/g,'');
    }

    if(params.refresh){
        mobfoxConfig.refresh= params.refresh;
    }

    if(params.timeout){
        mobfoxConfig.timeout= params.timeout;
    }

    var confID = "mobfoxConf_"+String(Math.random()).slice(2);
    script.id = confID;
    if(!window.mobfoxConfig){
        window.mobfoxConfig = {};
    }

    window.mobfoxConfig[confID] = mobfoxConfig;

    var sdk = document.createElement("script");
    sdk.src = "/ad.js";
    sdk.dataset.mobfoxconf = confID;
    document.head.appendChild(sdk);
    //-----------------------------
})();
