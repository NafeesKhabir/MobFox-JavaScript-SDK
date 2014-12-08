var chai = require('./chai.js');
require('./terminal-colors');

//-----------------------------------------------------
phantom.onError = function(msg, trace) {
  console.log(msg.red);
  var msgStack = [];
  if (trace && trace.length) {
    trace.forEach(function(t) {
      msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
    });
  }
  console.error(msgStack.join('\n').red);
  console.log("✗ failed".red.bold);
  phantom.exit(1);
};
//-----------------------------------------------------
var test = {
    name : function(name){
        console.log(" - Running test: "+name.bold);
    },
    expect : function(total){
        this.total = total;
        this.count = 0;
    },
    done : function(){
        if(this.failed) return;
        if(this.total && this.total !== this.count){
            console.log("Number of expected assertions ({{total}}) is different from number of actual assertions ({{count}}).".red
                .replace('{{total}}',this.total)
                .replace('{{count}}',this.count)
            );
            console.log("✗ failed".red.bold);
            phantom.exit(1);
        }
        console.log("✓ passed".green);
        phantom.exit();
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
