var page    = require('webpage').create(),
    url     = 'http://127.0.0.1:8080/passback.html';
    test    = require('./lib/harness.js');

test.expect(2);
page.onConsoleMessage = function(msg, lineNum, sourceId) {
    test.equal(msg,"nothing to show here.");
};

page.open(url, function (status) {
    test.done();
});

page.onResourceRequested = function(requestData, networkRequest) {
  console.log('^ '+requestData.url);
};

page.onResourceReceived = function(response) {
  console.log("> "+response.url);
};
