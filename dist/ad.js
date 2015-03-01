(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = require('./lib/');

},{"./lib/":2}],2:[function(require,module,exports){
// Load modules

var Stringify = require('./stringify');
var Parse = require('./parse');


// Declare internals

var internals = {};


module.exports = {
    stringify: Stringify,
    parse: Parse
};

},{"./parse":3,"./stringify":4}],3:[function(require,module,exports){
// Load modules

var Utils = require('./utils');


// Declare internals

var internals = {
    delimiter: '&',
    depth: 5,
    arrayLimit: 20,
    parameterLimit: 1000
};


internals.parseValues = function (str, options) {

    var obj = {};
    var parts = str.split(options.delimiter, options.parameterLimit === Infinity ? undefined : options.parameterLimit);

    for (var i = 0, il = parts.length; i < il; ++i) {
        var part = parts[i];
        var pos = part.indexOf(']=') === -1 ? part.indexOf('=') : part.indexOf(']=') + 1;

        if (pos === -1) {
            obj[Utils.decode(part)] = '';
        }
        else {
            var key = Utils.decode(part.slice(0, pos));
            var val = Utils.decode(part.slice(pos + 1));

            if (!obj.hasOwnProperty(key)) {
                obj[key] = val;
            }
            else {
                obj[key] = [].concat(obj[key]).concat(val);
            }
        }
    }

    return obj;
};


internals.parseObject = function (chain, val, options) {

    if (!chain.length) {
        return val;
    }

    var root = chain.shift();

    var obj = {};
    if (root === '[]') {
        obj = [];
        obj = obj.concat(internals.parseObject(chain, val, options));
    }
    else {
        var cleanRoot = root[0] === '[' && root[root.length - 1] === ']' ? root.slice(1, root.length - 1) : root;
        var index = parseInt(cleanRoot, 10);
        var indexString = '' + index;
        if (!isNaN(index) &&
            root !== cleanRoot &&
            indexString === cleanRoot &&
            index >= 0 &&
            index <= options.arrayLimit) {

            obj = [];
            obj[index] = internals.parseObject(chain, val, options);
        }
        else {
            obj[cleanRoot] = internals.parseObject(chain, val, options);
        }
    }

    return obj;
};


internals.parseKeys = function (key, val, options) {

    if (!key) {
        return;
    }

    // The regex chunks

    var parent = /^([^\[\]]*)/;
    var child = /(\[[^\[\]]*\])/g;

    // Get the parent

    var segment = parent.exec(key);

    // Don't allow them to overwrite object prototype properties

    if (Object.prototype.hasOwnProperty(segment[1])) {
        return;
    }

    // Stash the parent if it exists

    var keys = [];
    if (segment[1]) {
        keys.push(segment[1]);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {

        ++i;
        if (!Object.prototype.hasOwnProperty(segment[1].replace(/\[|\]/g, ''))) {
            keys.push(segment[1]);
        }
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return internals.parseObject(keys, val, options);
};


module.exports = function (str, options) {

    if (str === '' ||
        str === null ||
        typeof str === 'undefined') {

        return {};
    }

    options = options || {};
    options.delimiter = typeof options.delimiter === 'string' || Utils.isRegExp(options.delimiter) ? options.delimiter : internals.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : internals.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : internals.arrayLimit;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : internals.parameterLimit;

    var tempObj = typeof str === 'string' ? internals.parseValues(str, options) : str;
    var obj = {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0, il = keys.length; i < il; ++i) {
        var key = keys[i];
        var newObj = internals.parseKeys(key, tempObj[key], options);
        obj = Utils.merge(obj, newObj);
    }

    return Utils.compact(obj);
};

},{"./utils":5}],4:[function(require,module,exports){
// Load modules

var Utils = require('./utils');


// Declare internals

var internals = {
    delimiter: '&',
    indices: true
};


internals.stringify = function (obj, prefix, options) {

    if (Utils.isBuffer(obj)) {
        obj = obj.toString();
    }
    else if (obj instanceof Date) {
        obj = obj.toISOString();
    }
    else if (obj === null) {
        obj = '';
    }

    if (typeof obj === 'string' ||
        typeof obj === 'number' ||
        typeof obj === 'boolean') {

        return [encodeURIComponent(prefix) + '=' + encodeURIComponent(obj)];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys = Object.keys(obj);
    for (var i = 0, il = objKeys.length; i < il; ++i) {
        var key = objKeys[i];
        if (!options.indices &&
            Array.isArray(obj)) {

            values = values.concat(internals.stringify(obj[key], prefix, options));
        }
        else {
            values = values.concat(internals.stringify(obj[key], prefix + '[' + key + ']', options));
        }
    }

    return values;
};


module.exports = function (obj, options) {

    options = options || {};
    var delimiter = typeof options.delimiter === 'undefined' ? internals.delimiter : options.delimiter;
    options.indices = typeof options.indices === 'boolean' ? options.indices : internals.indices;

    var keys = [];

    if (typeof obj !== 'object' ||
        obj === null) {

        return '';
    }

    var objKeys = Object.keys(obj);
    for (var i = 0, il = objKeys.length; i < il; ++i) {
        var key = objKeys[i];
        keys = keys.concat(internals.stringify(obj[key], key, options));
    }

    return keys.join(delimiter);
};

},{"./utils":5}],5:[function(require,module,exports){
// Load modules


// Declare internals

var internals = {};


exports.arrayToObject = function (source) {

    var obj = {};
    for (var i = 0, il = source.length; i < il; ++i) {
        if (typeof source[i] !== 'undefined') {

            obj[i] = source[i];
        }
    }

    return obj;
};


exports.merge = function (target, source) {

    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        }
        else {
            target[source] = true;
        }

        return target;
    }

    if (typeof target !== 'object') {
        target = [target].concat(source);
        return target;
    }

    if (Array.isArray(target) &&
        !Array.isArray(source)) {

        target = exports.arrayToObject(target);
    }

    var keys = Object.keys(source);
    for (var k = 0, kl = keys.length; k < kl; ++k) {
        var key = keys[k];
        var value = source[key];

        if (!target[key]) {
            target[key] = value;
        }
        else {
            target[key] = exports.merge(target[key], value);
        }
    }

    return target;
};


exports.decode = function (str) {

    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
        return str;
    }
};


exports.compact = function (obj, refs) {

    if (typeof obj !== 'object' ||
        obj === null) {

        return obj;
    }

    refs = refs || [];
    var lookup = refs.indexOf(obj);
    if (lookup !== -1) {
        return refs[lookup];
    }

    refs.push(obj);

    if (Array.isArray(obj)) {
        var compacted = [];

        for (var i = 0, il = obj.length; i < il; ++i) {
            if (typeof obj[i] !== 'undefined') {
                compacted.push(obj[i]);
            }
        }

        return compacted;
    }

    var keys = Object.keys(obj);
    for (i = 0, il = keys.length; i < il; ++i) {
        var key = keys[i];
        obj[key] = exports.compact(obj[key], refs);
    }

    return obj;
};


exports.isRegExp = function (obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};


exports.isBuffer = function (obj) {

    if (obj === null ||
        typeof obj === 'undefined') {

        return false;
    }

    return !!(obj.constructor &&
        obj.constructor.isBuffer &&
        obj.constructor.isBuffer(obj));
};

},{}],6:[function(require,module,exports){
var cleanAd = function(ad){
    
    var cleaned;

    if(ad.indexOf("<iframe") >=0){
        cleaned = ad;
    }
    else if(ad.indexOf("</html>") > 0){
        /*var end = ad.match(/<\/html>(.*)$/);
        if(end){
            var pixel = end[1];
            console.log(pixel);
            cleaned = ad.replace(pixel,"");
        }*/
        cleaned = ad;
    }
    else if(ad.indexOf("</body>") > 0){
        cleaned = ["<html>",ad,"</html>"].join("\n");
    }
    else{
        cleaned = ["<html><body style='margin:0px;padding:0px;'>",ad,"</body></html>"].join("\n");
    }

    return cleaned;
};
//----------------------------------------------------------------
function addCloseButton(div,options){

    options = options || {};
    var button = document.createElement('canvas');

    div.appendChild(button);
    button.onclick = function(){
       div.parentNode.removeChild(div); 
    };
    button.style.position   = "absolute";
    button.style.width      =  (options.width || 40) + "px";
    button.style.height     =  (options.height || 40) + "px";
    button.style.top        =  (options.top || 10 ) + "px";
    button.style.right      =  (options.right || 10) + "px";   
    button.width = 40;
    button.height = 40;
    button.style.cursor = "pointer";
    button.id = "mobfox_dismiss"; 

    var ctx = button.getContext('2d');
    ctx.rect(0,0,40,40);
    ctx.fillStyle="#fff";
    ctx.fill();

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;

    ctx.rect(0,0,40,40);
    ctx.stroke();

    ctx.lineWidth = 8;
    ctx.beginPath();

    ctx.moveTo(10, 10);
    ctx.lineTo(30, 30);

    ctx.moveTo(10, 30);
    ctx.lineTo(30, 10);
    ctx.stroke();
}
//----------------------------------------------------------------
function createOnClickCallback(mobfoxClickURL,starboltClickURL){

    return function(){

        if(!starboltClickURL) return true;

        var anchor = document.createElement("a");
        anchor.href=  starboltClickURL || mobfoxClickURL;
        anchor.target = "_top";
        document.body.appendChild(anchor);
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

        if(!starboltClickURL){
            anchor.dispatchEvent(evt);
            return;
        }

        var registerMobfoxClick = document.createElement("script");
        registerMobfoxClick.src = mobfoxClickURL;
        registerMobfoxClick.onload = registerMobfoxClick.onerror = function(){
            anchor.dispatchEvent(evt);
        };
        document.body.appendChild(registerMobfoxClick);
    };
}
//----------------------------------------------------------------
function writeToIFrame(iframe,html){

            var iframeWin= (iframe.contentWindow) ? iframe.contentWindow : (iframe.contentDocument.document) ? iframe.contentDocument.document : iframe.contentDocument;
            iframeWin.document.open();
            iframeWin.document.write(html);
            iframeWin.document.close();
            iframe.sandbox="allow-top-navigation allow-popups allow-scripts";
}
//----------------------------------------------------------------
module.exports = {

    createBanner : function(ad,ad_id,confElement,mobfoxConfig){

        if(confElement.parentNode && confElement.parentNode.tagName.toLowerCase() === "head"){
            confElement = document.body; 
        }

        var iframe = document.getElementById(ad_id);
        if(iframe){
            iframe.parentNode.removeChild(iframe);
        }

        var containerDiv = document.createElement("div");
        containerDiv.style.margin = "0px";
        containerDiv.style.padding= "0px";
        containerDiv.style.border= "none";   
        containerDiv.style.cursor= "pointer";   

        containerDiv.id = "container_"+ad_id;
        confElement.parentNode.insertBefore(containerDiv,confElement);

        var cleaned = cleanAd(ad.content);

        //extractClickURL(cleaned,function(err,clickURL){

            //containerDiv.onclick = createOnClickCallback(ad.url,clickURL); 

            iframe = document.createElement("iframe");
            iframe.id = ad_id;
            iframe.className = "mobfox_iframe"; 
            iframe.width= mobfoxConfig.width;
            iframe.height= mobfoxConfig.height;
            //iframe.style.pointerEvents = "none";

            //iframe.src = "data:text/html;charset=utf-8," + cleaned;

            iframe.onload = function(){
                writeToIFrame(iframe,cleaned);
            };
            containerDiv.appendChild(iframe);

            iframe.style.margin = "0px";
            iframe.style.padding= "0px";
            iframe.style.border= "none";   

            iframe.scrolling = "no";
            iframe.style.overflow = "hidden";
        //});
        
    },

    createInterstitial : function(ad,ad_id,confElement,mobfoxConfig){
            
        if(confElement.parentNode && confElement.parentNode.tagName.toLowerCase() === "head"){
            confElement = document.body; 
        }

        var adContainer = document.getElementById('mobfox_interstitial');
        if(adContainer){
            adContainer.parentNode.removeChild(iframe);
        }

        adContainer = document.createElement('div'); 
        adContainer.id = "mobfox_interstitial";
        adContainer.style.width  = window.innerWidth + "px";
        adContainer.style.height = window.innerHeight + "px";
        adContainer.style.zIndex = "1000000";
        adContainer.style.backgroundColor = "transparent";
        adContainer.style.position = "fixed";
        adContainer.style.left = "0px";
        adContainer.style.top = "0px";
        adContainer.style.margin = "0px";
        adContainer.style.padding= "0px";
        adContainer.style.border= "none";
        document.body.appendChild(adContainer);
        
        var cleaned = cleanAd(ad.content);

        var containerDiv = document.createElement("div");
        containerDiv.style.margin = "0px";
        containerDiv.style.padding= "0px";
        containerDiv.style.border= "none";
        containerDiv.style.cursor= "pointer";   
        containerDiv.id = "container_"+ad_id;

        adContainer.appendChild(containerDiv);

       // extractClickURL(cleaned,function(err,clickURL){

            //containerDiv.onclick = createOnClickCallback(ad.url,clickURL); 
            
            var iframe = document.createElement('iframe');
            iframe.id = ad_id;
            iframe.className = "mobfox_iframe";
            iframe.width= mobfoxConfig.width;
            iframe.height= mobfoxConfig.height;
            //iframe.src = "data:text/html;charset=utf-8, "+escape(cleaned);

           // if(clickURL){
           //     iframe.style.pointerEvents = "none";
           // }

            containerDiv.appendChild(iframe);

            iframe.onload = function(){
                writeToIFrame(iframe,cleaned);
            };

            iframe.style.margin = "0px auto";
            iframe.style.padding= "0px";
            iframe.style.border= "none";
            iframe.style.display= "block";

            iframe.scrolling = "no";
            iframe.style.overflow = "hidden";

            addCloseButton(adContainer);

            setTimeout(function(){
               adContainer.parentNode.removeChild(adContainer); 
            },mobfoxConfig.timeout || 16000);
       // });
    },
    createFloating : function(ad,ad_id,confElement,mobfoxConfig){
        
        if(confElement.parentNode && confElement.parentNode.tagName.toLowerCase() === "head"){
            confElement = document.body; 
        }

        var adContainer = document.getElementById('mobfox_floating');
        if(adContainer){
            adContainer.parentNode.removeChild(iframe);
        }

        adContainer = document.createElement('div'); 
        adContainer.id = "mobfox_floating";

        adContainer.style.width= mobfoxConfig.width+"px";
        adContainer.style.height= mobfoxConfig.height+"px";

        adContainer.style.zIndex = "1000000";
        adContainer.style.position = "fixed";
        adContainer.style.bottom = "0px";
        adContainer.style.margin = "0px";
        adContainer.style.padding= "0px";
        adContainer.style.border= "none";
        document.body.appendChild(adContainer);
        
        var cleaned = cleanAd(ad.content);

        var containerDiv = document.createElement("div");

        containerDiv.style.margin = "0px";
        containerDiv.style.padding= "0px";
        containerDiv.style.border= "none";   
        containerDiv.style.cursor= "pointer";   
        containerDiv.id = "container_"+ad_id;

        adContainer.appendChild(containerDiv);

        //extractClickURL(cleaned,function(err,clickURL){

            //containerDiv.onclick = createOnClickCallback(ad.url,clickURL); 

            var iframe = document.createElement('iframe');
            iframe.id = ad_id;
            iframe.className = "mobfox_iframe";
            iframe.width= mobfoxConfig.width;
            iframe.height= mobfoxConfig.height;
            //iframe.src = "data:text/html;charset=utf-8, "+escape(cleaned);

            //center it
            adContainer.style.left = ((window.innerWidth - parseInt(adContainer.style.width)) / 2) + "px";

            iframe.style.margin = "0px auto";
            iframe.style.padding= "0px";
            iframe.style.border= "none";
            iframe.style.display= "block";

            iframe.scrolling = "no";
            iframe.style.overflow = "hidden";
           // iframe.style.pointerEvents = "none";

            if(mobfoxConfig.closeButton === false) return;

            containerDiv.appendChild(iframe);

            iframe.onload = function(){
                writeToIFrame(iframe,cleaned);
            };

            addCloseButton(adContainer,{width:20,height:20,top:5,right:5});
       // });

    }

};

},{}],7:[function(require,module,exports){
//var htmlparser  = require("htmlparser");

module.exports = function(window,refE,passback,options,cb){

    var iframe= window.document.createElement("iframe");
    
    iframe.src = ["data:text/html;charset=utf-8," ,"<style>body{margin:0;}</style>",decodeURIComponent(passback)].join("");

    if(options.confID){
        refE = document.querySelector("#mobfoxConf_"+options.confID);
        if(refE.parentNode === document.head){
            document.body.appendChild(iframe);
        }
        else{
            refE.parentNode.insertBefore(iframe,refE);
        }
    }
    else if(refE){
        refE.parentNode.insertBefore(iframe,refE);
    }
    else{
        window.document.body.appendChild(iframe);
    }

    iframe.style.width = options.width+"px";
    iframe.style.height= options.height+"px";
    iframe.style.margin = "0px";
    iframe.style.border= "none";
    iframe.style.overflowY =  "hidden";
    iframe.frameBorder = 0;
    iframe.seamless="seamless";
    iframe.scrolling = "no";
};


},{}],8:[function(require,module,exports){
(function(){

    var Qs              = require('qs'),
        ads             = require('./ads.js'),
        appendPassback  = require('./appendPassback.js'),
        confE = document.currentScript && document.currentScript.previousElementSibling,
        confMatch = document.currentScript && document.currentScript.src.match(/conf_id=(\d+)/),
        confID = confMatch && confMatch[1],
        mobfoxVar       = "mobfox_" + String(Math.random()).slice(2),
        refreshInterval,
        createAd = {
            banner          : ads.createBanner,
            interstitial    : ads.createInterstitial,
            floating        : ads.createFloating
        }; 

    var mobfoxConfig;
    if(confID){
        mobfoxConfig = window.mobfoxConfig[confID];
        confE = document.querySelector('#mobfoxConf_'+confID);
    }
    else{
        if(!confE || confE.className.indexOf("mobfoxConfig") < 0){
            confE = document.querySelector('.mobfoxConfig');
            if(!confE){
                confE = document.querySelector("#mobfoxConfig");
            }
        }

        if(confE.innerHTML){
            eval(confE.innerHTML);
        }
        mobfoxConfig = window.mobfoxConfig;
    }
    //-------------------------------------------
    function retrieve(){
        var script  = document.createElement("script"),
            options = [
                "o_androidid",
                "o_androidimei",
                "o_iosadvid",
                "o_andadvid",
                "longitude",
                "latitude",
                "demo.gender",
                "demo.keyword",
                "demo.age",
                "adspace.strict",
                "no_markup",
                "s_subid",
                "allow_mr",
                "r_floor" ,
                "testURL"
            ],
            params = {
                r_type  : 'banner',//mobfoxConfig.type,
                u       : window.navigator.userAgent,
                s       : mobfoxConfig.publicationID,
                p       : window.location.href,
                m       : mobfoxConfig.debug ? 'test' : 'live',
                rt      : 'javascript',
                v       : '3.0',
                'adspace.width' : mobfoxConfig.width,
                'adspace.height' : mobfoxConfig.height,
                timeout : mobfoxConfig.timeout,
                jsvar : mobfoxVar
            };

   
        options.forEach(function(o){
            if(typeof(mobfoxConfig[o]) !== 'undefined'){
                params[o] = mobfoxConfig[o];
            }
        });

        if(params.testURL){
            if(!window.mobfoxCount) window.mobfoxCount = 1;
            params.jsvar = mobfoxVar = "mobfox_test" + (window.mobfoxCount > 1 ? window.mobfoxCount : "");
            window.mobfoxCount ++;
        }

        //var start = (new Date()).getTime();


        var url = params.testURL || 'http://my.mobfox.com/request.php';
        script.type = "text/javascript";
        script.onload = script.onerror = function(){
            //var end = (new Date()).getTime();

            script.parentNode.removeChild(script);
            if(!window[mobfoxVar]){

                window.clearInterval(refreshInterval);

                if(mobfoxConfig.passback){
                    if(typeof(mobfoxConfig.passback) === "function"){
                        mobfoxConfig.passback();
                    }
                    else if(typeof(mobfoxConfig.passback) === "string"){
                        appendPassback(window,confE,mobfoxConfig.passback,{width:mobfoxConfig.width,height:mobfoxConfig.height,confID:confID},function(err){
                            //...
                        });
                    }
                }
                return;
            }


            mobfoxConfig.timeout = params.timeout;
            createAd[mobfoxConfig.type](window[mobfoxVar][0],mobfoxVar,confE,mobfoxConfig);

        };

        script.src = url + '?' + Qs.stringify(params);
        document.head.appendChild(script);

    }
    //-------------------------------------------

    if(mobfoxConfig.refresh){
        refreshInterval = setInterval(retrieve,mobfoxConfig.refresh);
    }
    retrieve();

})();

},{"./ads.js":6,"./appendPassback.js":7,"qs":1}]},{},[8]);
