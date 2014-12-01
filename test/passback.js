var page = require('webpage').create();
var url = 'http://127.0.0.1:8080/passback.html';


page.onConsoleMessage = function(msg, lineNum, sourceId) {
    console.log("yoyoy");
    console.log(msg === "nothing to show here.");
};

page.open(url, function (status) {
  phantom.exit();
});

