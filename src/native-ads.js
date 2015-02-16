var mustache = require('mustache');
//--------------------------------------------------------------
module.exports.createImageAd = function(adData,options){
        
        var ref             = options.referenceE,
            doppleganger    = document.createElement("a"),
            img             = document.createElement("img"),
            title           = document.createElement("div");

        doppleganger.href           = adData.click_url;
        doppleganger.style.width    = ref.offsetWidth + "px";
        doppleganger.style.height   = ref.offsetHeight + "px";
        doppleganger.style.display  = "block";
        doppleganger.style.position = "relative";
        ref.parentNode.insertBefore(doppleganger,ref);

        if(options.replace){
            ref.parentNode.removeChild(ref);
        }

        doppleganger.appendChild(img);
        img.style.width     = "100%";
        img.style.height    = "100%";
        img.src = adData.imageassets.icon.url;

        doppleganger.appendChild(title);
        title.innerHTML         = [adData.textassets.headline,"-",adData.textassets.cta].join(" ");
        title.style.height      = "20%";
        title.style.position    = "absolute";
        title.style.top         = "0px";
        title.style.width       = "100%";
        title.style.background  = "#fff";
        title.style.opacity     = "0.7";
        title.style.color       = "#000";
        title.style.lineHeight  = (doppleganger.offsetHeight/5)+"px";
        title.style.fontSize    = (doppleganger.offsetHeight/10)+"px";
        title.style.fontWeight  = "bold";
        title.style.textAlign   = "center";
};
//--------------------------------------------------------------
var renderNativeAd = module.exports.renderNativeAd = function(data,tmpl,options){

    var view = {
            config : options,
            headline :data.textassets.headline,
            cta :data.textassets.cta,
            description :data.textassets.description,
            icon : data.imageassets.icon,
            main : data.imageassets.main,
            click_url :data.click_url
    };

    return mustache.render(tmpl, view); 
};
//--------------------------------------------------------------
module.exports.createBannerAd = function(adData,options){
   
    var nativeBannerTmpl = require('./templates/native-banner.tmpl');
    if(options.nativeType === "article"){
        nativeBannerTmpl = require('./templates/native-banner-article.tmpl');
    }

    var ad                  = renderNativeAd(adData,nativeBannerTmpl,options), 
        ref                 = options.referenceE,
        doppleganger        = document.createElement(ref.tagName);

    doppleganger.className = ref.className;

    doppleganger.style.boxSizing        = "border-box";
    doppleganger.innerHTML              = ad;
    
    ref.parentNode.insertBefore(doppleganger,ref.nextSibling);

    if(options.replace){
        ref.parentNode.removeChild(ref);
    }
};
//--------------------------------------------------------------
