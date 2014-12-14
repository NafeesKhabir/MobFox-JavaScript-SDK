var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/banner-old.html',
    test    =   require('./lib/harness.js'),
    start;

test.name('banner timing old');
test.expect(0);

start = (new Date()).getTime();

page.open(url);

page.onResourceReceived = function(response) {
    if(response.url === "http://creative1cdn.mobfox.com/mftext/320x50/315C93/fff&text=MobFox%20Test%20Ad"){
        var end = (new Date()).getTime();
        console.log((end-start));
        test.done();
    }
};

/*page.onResourceRequested = function(requestData, networkRequest) {
  console.log('^ '+requestData.url);
};

page.onResourceReceived = function(response) {
  console.log("> "+response.url);
};*/
