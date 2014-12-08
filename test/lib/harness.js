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
  console.log("Test failed".red);
  phantom.exit(1);
};
//-----------------------------------------------------
var test = {
    expect : function(total){
        this.total = total;
        this.count = 0;

    },
    done : function(){
        if(this.total){
            console.log("Number of expected assertions ({{total}}) is different from number of actual assertions {{count}}.".red
                .replace('{{total}}',this.total)
                .replace('{{count}}',this.count)
            );
            console.log("Test failed".red);
            phantom.exit(1);
        }
        console.log("Test passed".green);
        phantom.exit();
    }
};

['ok','equal'].forEach(function(verb){
    test.__defineGetter__(verb, function(){
        var self = this;
        return function(){
            try{
                chai.assert[verb].apply(null,arguments);
            }
            catch(e){
                setTimeout(function(){
                    throw e;
                },1);
            }
            if(self.count) self.count++;
        };
    });
});

module.exports = Object.create(test);
