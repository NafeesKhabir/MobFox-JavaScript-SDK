var page    =   require('webpage').create(),
    url     =   'http://127.0.0.1:8080/passback-one-tag.html',
    test    =   require('./lib/harness.js');

test.name('passback one tag');
test.expect(1);
page.onConsoleMessage = function(msg, lineNum, sourceId) {
    test.equal(msg,"ya ya ya!");
    test.done();
};

page.open(url, function (status) {
});

