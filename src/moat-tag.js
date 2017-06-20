var moat_init = function(invh, bundle, json) {
    try {
        var MOAT_DEMAND_ID      = json.request.demandPartner.id;
        var MOAT_INVENTORY_ID   = invh;
        var MOAT_BUNDLE_ID      = bundle;
        
        var classname = 'MOAT-matomygen2029925883?moatClientLevel1='+MOAT_DEMAND_ID+'&amp;moatClientLevel2='+MOAT_INVENTORY_ID+'&amp;moatClientLevel3='+MOAT_BUNDLE_ID;
        var src = 'https://z.moatads.com/matomygen2029925883/moatad.js#moatClientLevel1='+MOAT_DEMAND_ID+'&moatClientLevel2='+MOAT_INVENTORY_ID+'&moatClientLevel3='+MOAT_BUNDLE_ID;
        
        var noscript = document.createElement('noscript');
        noscript.className = classname;
        
        var script  = document.createElement('script');
        script.id   = 'mobfoxmoat';
        script.setAttribute('type'  , 'text/javascript');
        script.setAttribute('src'   , src);
        
        document.body.appendChild(noscript);
        document.body.appendChild(script);
    } catch(e) {
        console.log(e);
    }
}