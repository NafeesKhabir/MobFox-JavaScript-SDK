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
    if(ad.indexOf("</html>") > 0){
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
module.exports = {

    createBanner : function(ad,ad_id,confElement){
        var iframe = document.getElementById(ad_id);
        if(iframe){
            iframe.parentNode.removeChild(iframe);
        }

        iframe = document.createElement("iframe");
        iframe.id = ad_id;
        iframe.className = "mobfox_iframe"; 
        iframe.width= mobfoxConfig.width;
        iframe.height= mobfoxConfig.height;

        iframe.src = "data:text/html;charset=utf-8," + cleanAd(ad);

        confElement.parentNode.insertBefore(iframe,confElement);

        /*var iFrameDoc = document.getElementById(ad_id).contentWindow.document;
        iFrameDoc.write(cleanAd(ad));
        iFrameDoc.close();*/

        iframe.style.margin = "0px";
        iframe.style.padding= "0px";
        iframe.style.border= "none";   

        iframe.scrolling = "no";
        iframe.style.overflow = "hidden";
    },

    createInterstitial : function(ad,ad_id,confElement,timeout){
            
        var adContainer = document.getElementById('mobfox_interstitial');
        if(adContainer){
            adContainer.parentNode.removeChild(iframe);
        }

        adContainer = document.createElement('iframe'); 
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
        
        adContainer.contentWindow.document.body.style.margin = "0px";

        var iframe = adContainer.contentWindow.document.createElement('iframe');
        iframe.id = ad_id;
        iframe.className = "mobfox_iframe";
        iframe.width= mobfoxConfig.width;
        iframe.height= mobfoxConfig.height;
        iframe.src = "data:text/html;charset=utf-8, "+escape(cleanAd(ad));
        adContainer.contentWindow.document.body.appendChild(iframe);

        /*var iFrameDoc = iframe.contentWindow.document;
        iFrameDoc.write(cleanAd(ad));
        iFrameDoc.close();*/


        iframe.style.margin = "0px auto";
        iframe.style.padding= "0px";
        iframe.style.border= "none";
        iframe.style.display= "block";

        iframe.scrolling = "no";
        iframe.style.overflow = "hidden";

        var button = adContainer.contentWindow.document.createElement('canvas');
        adContainer.contentWindow.document.body.appendChild(button);

        button.onclick = function(){
           adContainer.parentNode.removeChild(adContainer); 
        };
        button.style.position   = "absolute";
        button.style.width      = "40px";
        button.style.height     = "40px";
        button.style.top        = "10px";
        button.style.right      = "10px";   
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

        setTimeout(function(){
           adContainer.parentNode.removeChild(adContainer); 
        },timeout || 16000);
    },

    createFloating : function(ad,ad_id,confElement){
        
        var adContainer = document.getElementById('mobfox_floating');
        if(adContainer){
            adContainer.parentNode.removeChild(iframe);
        }

        adContainer = document.createElement('iframe'); 
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
        
        adContainer.contentWindow.document.body.style.margin = "0px";

        var iframe = adContainer.contentWindow.document.createElement('iframe');
        iframe.id = ad_id;
        iframe.className = "mobfox_iframe";
        iframe.width= mobfoxConfig.width;
        iframe.height= mobfoxConfig.height;
        iframe.src = "data:text/html;charset=utf-8, "+escape(cleanAd(ad));
        adContainer.contentWindow.document.body.appendChild(iframe);

        //center it
        adContainer.style.left = ((window.innerWidth - parseInt(adContainer.style.width)) / 2) + "px";

        iframe.style.margin = "0px auto";
        iframe.style.padding= "0px";
        iframe.style.border= "none";
        iframe.style.display= "block";

        iframe.scrolling = "no";
        iframe.style.overflow = "hidden";

        if(mobfoxConfig.closeButton === false) return;

        var button = adContainer.contentWindow.document.createElement('canvas');
        adContainer.contentWindow.document.body.appendChild(button);

        button.onclick = function(){
           adContainer.parentNode.removeChild(adContainer); 
        };
        button.style.position   = "absolute";
        button.style.width      = "20px";
        button.style.height     = "20px";
        button.style.top        = "5px";
        button.style.right      = "5px";   
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

};

},{}],7:[function(require,module,exports){
(function(){

    var Qs      = require('qs'),
        ads     = require('./ads.js'),
        confE   = document.getElementById("mobfoxConfig"),
        mobfoxVar   = "mobfox_" + String(Math.random()).slice(2),
        refreshInterval,
        createAd = {
            banner          : ads.createBanner,
            interstitial    : ads.createInterstitial,
            floating        : ads.createFloating
        }; 
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
                "r_floor" 
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

        confE.parentNode.insertBefore(script,confE);
        //var start = (new Date()).getTime();
        if(mobfoxConfig.publicationID === "test"){
            if(mobfoxConfig.type === "interstitial"){
                if(mobfoxConfig.testID){
                    script.src = "/js/response-inter-"+mobfoxConfig.testID+".js";
                }
                else{
                    script.src = "/js/response-inter.js";
                }
            }
            else{
                if(mobfoxConfig.testID){
                    script.src = "/js/response-banner-"+mobfoxConfig.testID+".js";
                }
                else{
                    script.src = "/js/response-banner.js";
                }
            }
            mobfoxVar = "mobfox_test";
        }
        else{
            script.src = 'http://my.mobfox.com/request.php?' + Qs.stringify(params);
        }

        script.onload = function(){
            //var end = (new Date()).getTime();
            if(!window[mobfoxVar]){

                window.clearInterval(refreshInterval);

                script.parentNode.removeChild(script);
                if(mobfoxConfig.passback){
                    if(typeof(mobfoxConfig.passback) === "function"){
                        mobfoxConfig.passback();
                    }
                    else if(typeof(mobfoxConfig.passback) === "string"){
                        eval(mobfoxConfig.passback+"()"); 
                    }
                }
                return;
            }

            createAd[mobfoxConfig.type](window[mobfoxVar][0].content,mobfoxVar,confE,params.timeout);

            script.parentNode.removeChild(script);
        };
    }
    //-------------------------------------------

    if(mobfoxConfig.refresh){
        refreshInterval = setInterval(retrieve,mobfoxConfig.refresh);
    }
    retrieve();

})();

},{"./ads.js":6,"qs":1}]},{},[7]);
