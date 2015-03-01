var chai = require('./chai.js');
var ansi = require('./ansi-styles.js');

//-----------------------------------------------------
phantom.onError = function(msg, trace) {
  console.log([ansi.red.open,msg,ansi.red.close].join(""));
  var msgStack = [];
  if (trace && trace.length) {
    trace.forEach(function(t) {
      msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
    });
  }
  console.error([ansi.red.open,msgStack.join('\n'),ansi.red.close].join(""));
  console.log([ansi.red.open,ansi.bold.open,"✗ failed",ansi.bold.close,ansi.red.close].join(""));
  slimer.exit(1);
};
//-----------------------------------------------------
var test = {
    name : function(testName){
        console.log([" - Running test: ",ansi.bold.open,testName,ansi.bold.close].join(""));
    },
    expect : function(total){
        this.total = total;
        this.count = 0;
    },
    done : function(){
        if(this.failed) return;
        if(this.total && this.total !== this.count){
            console.log([ansi.red.open,"Number of expected assertions ({{total}}) is different from number of actual assertions ({{count}}).",ansi.red.close].join("")
                .replace('{{total}}',this.total)
                .replace('{{count}}',this.count)
            );
            console.log([ansi.red.open,ansi,bold.open,"✗ failed".ansi.bold.close,ansi.red.close].join(""));
            slimer.exit(1);
        }
        console.log([ansi.green.open,"✓ passed",ansi.green.close].join(""));
        slimer.exit();
    }
};
//----------------------------------------------
['ok','equal'].forEach(function(verb){
    test.__defineGetter__(verb, function(){
        var self = this;
        return function(){
            var args = Array.prototype.slice.call(arguments);
            try{
                chai.assert[verb].apply(null,args);
                if(typeof(self.count)==='number'){
                    self.count++;
                }
            }
            catch(e){
                self.failed = true;//flag to wait for exception to propogate
                return setTimeout(function(){
                    throw e;
                },1);
            }
        };
    });
});
//----------------------------------------------
module.exports = Object.create(test);
