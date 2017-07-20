var X2JS            = require('./res/js/x2js.js'),
    x2js            = new X2JS(),
    superagent      = require('superagent'),
    async           = require('async'),
    cpm             = require('./cpm.js'),
    loadingPoster   = require('./res/images/loading.txt'),
    audioPoster     = require('./res/images/poster.txt');

//----------------------------------------- members

var self            = this;
self.errorTrackers  = [];

//----------------------------------------- utils

var formatURL = function(urlObj) {
    if(!urlObj) return "";
    return (urlObj.__cdata || urlObj.__text || urlObj).replace(/[\r\n\s]*/g,"");
};

//----------------------------------------- network

var reportError = function(vasts, errCode, cb) {
    if (vasts.errorTrackers.length == 0) {
        cb();
    }
    async.each(vasts.errorTrackers,
        function(t, errRepCB) {
            t = t.replace("[ERRORCODE]", errCode);
            superagent.get(t).end(errRepCB);
        },
        cb
    );
};

//----------------------------------------- vast

window.collect = function(vast_array, cb) {
    if (typeof vast_array === 'string') {
        vast_array = JSON.parse(vast_array);
    }
    
    var vasts           = {};
    vasts.errorTrackers = [];
    vasts.arr           = [];
    
    for (var i = 0; i < vast_array.length; i++) {
        var vast_str = vast_array[i];
        console.log(vast_array[i]);
        var json = x2js.xml_str2json(vast_str);
        if (!json) {
            reportError(vasts, "100", function() {
                cb("error parsing xml");
            });
            return;
        }
        if (!json.VAST && !json.DAAST && !json.error) {
            reportError(vasts, "101", function() {
                cb("xml not valid VAST or DAAST");
            });
            return;
        }
        if (json.error) {
            reportError(vasts, "303", function() {
                if (typeof(json.error) === "string" && json.error.trim() === "No Ad Available") cb({noAd:true});
                else cb(json.error);
            });
            return;
        }
        
        var vast = json.VAST || json.DAAST;
        
        if (vast && vast.Error) {
            if (vast.Error.__cdata) {
                vasts.errorTrackers.push(vast.Error.__cdata);
            }
            reportError(vasts, "303", function() {
                cb({noAd:true});
            });
            return;
        }
        if (Object.keys(vast).length === 0 || (Object.keys(vast).length === 1 && vast._version)) {
            reportError(vasts, "303", function() {
                cb({noAd:true});
            });
            return;
        }
        
        if (vast && vast.Ad && vast.Ad.Wrapper && vast.Ad.Wrapper.Error) {
            if (vast.Ad.Wrapper.Error.__cdata) {
                vasts.errorTrackers.push(vast.Ad.Wrapper.Error.__cdata);
            }
        }
        if (vast && vast.Ad && vast.Ad.InLine && vast.Ad.InLine.Error) {
            errT = vast.Ad.InLine.Error;
            if (vast.Ad.InLine.Error.__cdata) {
                vasts.errorTrackers.push(vast.Ad.InLine.Error.__cdata);
            }
        }
                
        vasts.arr.push(json);
    }
    
    cb(null, vasts);
}