#!/usr/bin/env node
var fs      = require('fs'),
    path    = require('path'),
    spawn           = require('child_process').spawn;

require('shelljs/global');
process.chdir(path.dirname(require.main.filename));  

var staticServer    = spawn('static',['www']),
    init            = false;

staticServer.stdout.on('data', function (data) {
    if(init) return;
    init = true;
    fs.readdirSync('tests').filter(function(f){
        return f.match(/\.js$/);
    }).forEach(function(test){
        exec('phantomjs tests/'+test);
    });
    staticServer.kill();
});
