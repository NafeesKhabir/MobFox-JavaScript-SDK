var static  = require('node-static');
var fileServer = new static.Server('./test/www');

server = require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
});

server.listen(58080,function(){
    console.log('listening');
});