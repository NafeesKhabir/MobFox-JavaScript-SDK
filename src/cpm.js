module.exports.parse = function(res) {
    var cpm;
    Object.keys(res.headers).forEach(function(h) {
        if (h.toLowerCase().indexOf("x-pricing-cpm") !== 0) return;
        try {
            cpm = parseFloat(res.headers[h].trim());
        }
        catch(e) {
            return null;
        }
    });
    return cpm;
};