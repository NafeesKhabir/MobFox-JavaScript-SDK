/*var moatFail = function(reason) {
    if (mobFoxParams) {
        if (typeof(mobFoxParams.onFail)==="function") {
            mobFoxParams.onFail(reason);
        }
    }
};
var moatSuccess = function() {
    if (mobFoxParams) {
        if (typeof(mobFoxParams.onSuccess)==="function") {
            mobFoxParams.onSuccess();
        }
    }
};*/
window.moat_init = function(invh, bundle, json) {
    try {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        
        var MOAT_DEMAND_ID      = (json.request.demandPartner && json.request.demandPartner.id) || "dummy-dsp-id",
            MOAT_INVENTORY_ID   = invh,
            MOAT_BUNDLE_ID      = bundle,
            classname           = 'MOAT-matomygen2029925883?moatClientLevel1='+MOAT_DEMAND_ID+'&amp;moatClientLevel2='+MOAT_INVENTORY_ID+'&amp;moatClientLevel3='+MOAT_BUNDLE_ID,
            moatSrc             = 'https://z.moatads.com/matomygen2029925883/moatad.js#moatClientLevel1='+MOAT_DEMAND_ID+'&moatClientLevel2='+MOAT_INVENTORY_ID+'&moatClientLevel3='+MOAT_BUNDLE_ID;
        
        var noscript = document.createElement('noscript');
        noscript.className = classname;
        
        var script      = document.createElement('script');
        script.type     = 'text/javascript';
        script.src      = moatSrc;
        
        document.body.appendChild(noscript);
        document.body.appendChild(script);
        
        moatSuccess();
    } catch(e) {
        console.log(e);
    }
};
