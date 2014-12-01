var page = require('webpage').create(),
    chai = require('./chai.js'),
    url = 'http://127.0.0.1:8080/passback.html';

chai.should();

page.onConsoleMessage = function(msg, lineNum, sourceId) {
    msg.should.equal("nothing to show here.");
};

page.open(url, function (status) {
  phantom.exit();
});

