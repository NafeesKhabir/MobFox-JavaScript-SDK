var async       = require('async'),
    fs          = require('fs'),
    knox        = require('knox'),
    client = knox.createClient({
        key:'AKIAJCA4U7RFPSISDAHA',
        secret:'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',
        bucket:'starbolt'
    });

var testDir = fs.readdirSync("./www");

async.each(
        testDir,
        function(path,cb){
            client.putFile(
                "./www/"+path,
                path,
                function(err, res){
                    if(err) return cb(err);
                    res.resume();
                    cb();
                } 
            );
        },
        function(err){
            if(err) console.log(err);
        }
);
