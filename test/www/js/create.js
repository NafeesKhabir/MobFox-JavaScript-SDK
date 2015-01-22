var fs = require("fs");

var ad = fs.readFileSync("ad.html",{encoding:"utf-8"}),
    resp = require("./banner.json");

resp.content = ad;
var out = [resp];

console.log("var mobfox_test = "+JSON.stringify(out));

