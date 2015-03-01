var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/passback.html',
    test    =   require('./lib/harness.js');

test.name('passback callback');
test.expect(1);
page.onConsoleMessage = function(msg, lineNum, sourceId) {
    test.equal(msg,"nothing to show here.");
    test.done();
};

page.open(url, function (status) {
});

/*page.onResourceRequested = function(requestData, networkRequest) {
  console.log('^ '+requestData.url);
};

page.onResourceReceived = function(response) {
  console.log("> "+response.url);
};*/
