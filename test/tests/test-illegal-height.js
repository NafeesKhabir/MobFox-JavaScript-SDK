var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/illegal-height.html',
    test    =   require('./lib/harness.js');

test.name('test illegal height');
test.expect(1);

page.onError = function(msg, trace) {

 test.equal(msg,"uncaught exception: Invalid adspace_height: -50");
 test.done();

};
page.open(url);


