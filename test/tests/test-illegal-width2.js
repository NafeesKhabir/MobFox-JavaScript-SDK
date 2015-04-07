var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/illegal-width2.html',
    test    =   require('./lib/harness.js');

test.name('test illegal width2');
test.expect(1);

page.onError = function(msg, trace) {

 test.equal(msg,"uncaught exception: Invalid adspace_width: koko");
 test.done();

};
page.open(url);


