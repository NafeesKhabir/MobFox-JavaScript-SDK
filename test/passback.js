var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/passback.html',
    test    =   require('./lib/harness.js');

test.name('passback callback');
test.expect(1);
page.onConsoleMessage = function(msg, lineNum, sourceId) {
    test.equal(msg,"nothing to show here.");
};

page.open(url, function (status) {
});

page.onResourceReceived = function(response) {
    if(response.url.match(/http\:\/\/my\.mobfox\.com\/request\.php/)){
        setTimeout(function(){
            test.done();
        },1);
    }
};

/*page.onResourceRequested = function(requestData, networkRequest) {
  console.log('^ '+requestData.url);
};

page.onResourceReceived = function(response) {
  console.log("> "+response.url);
};*/
