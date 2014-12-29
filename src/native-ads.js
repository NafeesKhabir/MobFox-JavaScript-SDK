module.exports = {

    createNativeAd : function(adData,options){
        
        if(options.type === 'image'){

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
            title.style.bottom      = "0px";
            title.style.width       = "100%";
            title.style.background  = "#fff";
            title.style.opacity     = "0.7";
            title.style.color       = "#000";
            title.style.lineHeight  = title.offsetHeight+"px";
            title.style.fontSize    = (title.offsetHeight * 0.5)+"px";
            title.style.fontWeight  = "bold";
            title.style.textAlign   = "center";
        }
    }
};
