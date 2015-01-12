(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){(function(__filename,__dirname){(function(){function runningInNode(){return typeof require=="function"&&typeof exports=="object"&&typeof module=="object"&&typeof __filename=="string"&&typeof __dirname=="string"}if(!runningInNode()){if(!this.Tautologistics)this.Tautologistics={};else if(this.Tautologistics.NodeHtmlParser)return;this.Tautologistics.NodeHtmlParser={};exports=this.Tautologistics.NodeHtmlParser}var ElementType={Text:"text",Directive:"directive",Comment:"comment",Script:"script",Style:"style",Tag:"tag"};function Parser(handler,options){this._options=options?options:{};if(this._options.includeLocation==undefined){this._options.includeLocation=false}this.validateHandler(handler);this._handler=handler;this.reset()}Parser._reTrim=/(^\s+|\s+$)/g;Parser._reTrimComment=/(^\!--|--$)/g;Parser._reWhitespace=/\s/g;Parser._reTagName=/^\s*(\/?)\s*([^\s\/]+)/;Parser._reAttrib=/([^=<>\"\'\s]+)\s*=\s*"([^"]*)"|([^=<>\"\'\s]+)\s*=\s*'([^']*)'|([^=<>\"\'\s]+)\s*=\s*([^'"\s]+)|([^=<>\"\'\s\/]+)/g;Parser._reTags=/[\<\>]/g;Parser.prototype.parseComplete=function Parser$parseComplete(data){this.reset();this.parseChunk(data);this.done()};Parser.prototype.parseChunk=function Parser$parseChunk(data){if(this._done)this.handleError(new Error("Attempted to parse chunk after parsing already done"));this._buffer+=data;this.parseTags()};Parser.prototype.done=function Parser$done(){if(this._done)return;this._done=true;if(this._buffer.length){var rawData=this._buffer;this._buffer="";var element={raw:rawData,data:this._parseState==ElementType.Text?rawData:rawData.replace(Parser._reTrim,""),type:this._parseState};if(this._parseState==ElementType.Tag||this._parseState==ElementType.Script||this._parseState==ElementType.Style)element.name=this.parseTagName(element.data);this.parseAttribs(element);this._elements.push(element)}this.writeHandler();this._handler.done()};Parser.prototype.reset=function Parser$reset(){this._buffer="";this._done=false;this._elements=[];this._elementsCurrent=0;this._current=0;this._next=0;this._location={row:0,col:0,charOffset:0,inBuffer:0};this._parseState=ElementType.Text;this._prevTagSep="";this._tagStack=[];this._handler.reset()};Parser.prototype._options=null;Parser.prototype._handler=null;Parser.prototype._buffer=null;Parser.prototype._done=false;Parser.prototype._elements=null;Parser.prototype._elementsCurrent=0;Parser.prototype._current=0;Parser.prototype._next=0;Parser.prototype._location=null;Parser.prototype._parseState=ElementType.Text;Parser.prototype._prevTagSep="";Parser.prototype._tagStack=null;Parser.prototype.parseTagAttribs=function Parser$parseTagAttribs(elements){var idxEnd=elements.length;var idx=0;while(idx<idxEnd){var element=elements[idx++];if(element.type==ElementType.Tag||element.type==ElementType.Script||element.type==ElementType.style)this.parseAttribs(element)}return elements};Parser.prototype.parseAttribs=function Parser$parseAttribs(element){if(element.type!=ElementType.Script&&element.type!=ElementType.Style&&element.type!=ElementType.Tag)return;var tagName=element.data.split(Parser._reWhitespace,1)[0];var attribRaw=element.data.substring(tagName.length);if(attribRaw.length<1)return;var match;Parser._reAttrib.lastIndex=0;while(match=Parser._reAttrib.exec(attribRaw)){if(element.attribs==undefined)element.attribs={};if(typeof match[1]=="string"&&match[1].length){element.attribs[match[1]]=match[2]}else if(typeof match[3]=="string"&&match[3].length){element.attribs[match[3].toString()]=match[4].toString()}else if(typeof match[5]=="string"&&match[5].length){element.attribs[match[5]]=match[6]}else if(typeof match[7]=="string"&&match[7].length){element.attribs[match[7]]=match[7]}}};Parser.prototype.parseTagName=function Parser$parseTagName(data){if(data==null||data=="")return"";var match=Parser._reTagName.exec(data);if(!match)return"";return(match[1]?"/":"")+match[2]};Parser.prototype.parseTags=function Parser$parseTags(){var bufferEnd=this._buffer.length-1;while(Parser._reTags.test(this._buffer)){this._next=Parser._reTags.lastIndex-1;var tagSep=this._buffer.charAt(this._next);var rawData=this._buffer.substring(this._current,this._next);var element={raw:rawData,data:this._parseState==ElementType.Text?rawData:rawData.replace(Parser._reTrim,""),type:this._parseState};var elementName=this.parseTagName(element.data);if(this._tagStack.length){if(this._tagStack[this._tagStack.length-1]==ElementType.Script){if(elementName.toLowerCase()=="/script")this._tagStack.pop();else{if(element.raw.indexOf("!--")!=0){element.type=ElementType.Text;if(this._elements.length&&this._elements[this._elements.length-1].type==ElementType.Text){var prevElement=this._elements[this._elements.length-1];prevElement.raw=prevElement.data=prevElement.raw+this._prevTagSep+element.raw;element.raw=element.data=""}}}}else if(this._tagStack[this._tagStack.length-1]==ElementType.Style){if(elementName.toLowerCase()=="/style")this._tagStack.pop();else{if(element.raw.indexOf("!--")!=0){element.type=ElementType.Text;if(this._elements.length&&this._elements[this._elements.length-1].type==ElementType.Text){var prevElement=this._elements[this._elements.length-1];if(element.raw!=""){prevElement.raw=prevElement.data=prevElement.raw+this._prevTagSep+element.raw;element.raw=element.data=""}else{prevElement.raw=prevElement.data=prevElement.raw+this._prevTagSep}}else{if(element.raw!=""){element.raw=element.data=element.raw}}}}}else if(this._tagStack[this._tagStack.length-1]==ElementType.Comment){var rawLen=element.raw.length;if(element.raw.charAt(rawLen-2)=="-"&&element.raw.charAt(rawLen-1)=="-"&&tagSep==">"){this._tagStack.pop();if(this._elements.length&&this._elements[this._elements.length-1].type==ElementType.Comment){var prevElement=this._elements[this._elements.length-1];prevElement.raw=prevElement.data=(prevElement.raw+element.raw).replace(Parser._reTrimComment,"");element.raw=element.data="";element.type=ElementType.Text}else element.type=ElementType.Comment}else{element.type=ElementType.Comment;if(this._elements.length&&this._elements[this._elements.length-1].type==ElementType.Comment){var prevElement=this._elements[this._elements.length-1];prevElement.raw=prevElement.data=prevElement.raw+element.raw+tagSep;element.raw=element.data="";element.type=ElementType.Text}else element.raw=element.data=element.raw+tagSep}}}if(element.type==ElementType.Tag){element.name=elementName;var elementNameCI=elementName.toLowerCase();if(element.raw.indexOf("!--")==0){element.type=ElementType.Comment;delete element["name"];var rawLen=element.raw.length;if(element.raw.charAt(rawLen-1)=="-"&&element.raw.charAt(rawLen-2)=="-"&&tagSep==">")element.raw=element.data=element.raw.replace(Parser._reTrimComment,"");else{element.raw+=tagSep;this._tagStack.push(ElementType.Comment)}}else if(element.raw.indexOf("!")==0||element.raw.indexOf("?")==0){element.type=ElementType.Directive}else if(elementNameCI=="script"){element.type=ElementType.Script;if(element.data.charAt(element.data.length-1)!="/")this._tagStack.push(ElementType.Script)}else if(elementNameCI=="/script")element.type=ElementType.Script;else if(elementNameCI=="style"){element.type=ElementType.Style;if(element.data.charAt(element.data.length-1)!="/")this._tagStack.push(ElementType.Style)}else if(elementNameCI=="/style")element.type=ElementType.Style;if(element.name&&element.name.charAt(0)=="/")element.data=element.name}if(element.raw!=""||element.type!=ElementType.Text){if(this._options.includeLocation&&!element.location){element.location=this.getLocation(element.type==ElementType.Tag)}this.parseAttribs(element);this._elements.push(element);if(element.type!=ElementType.Text&&element.type!=ElementType.Comment&&element.type!=ElementType.Directive&&element.data.charAt(element.data.length-1)=="/")this._elements.push({raw:"/"+element.name,data:"/"+element.name,name:"/"+element.name,type:element.type})}this._parseState=tagSep=="<"?ElementType.Tag:ElementType.Text;this._current=this._next+1;this._prevTagSep=tagSep}if(this._options.includeLocation){this.getLocation();this._location.row+=this._location.inBuffer;this._location.inBuffer=0;this._location.charOffset=0}this._buffer=this._current<=bufferEnd?this._buffer.substring(this._current):"";this._current=0;this.writeHandler()};Parser.prototype.getLocation=function Parser$getLocation(startTag){var c,l=this._location,end=this._current-(startTag?1:0),chunk=startTag&&l.charOffset==0&&this._current==0;for(;l.charOffset<end;l.charOffset++){c=this._buffer.charAt(l.charOffset);if(c=="\n"){l.inBuffer++;l.col=0}else if(c!="\r"){l.col++}}return{line:l.row+l.inBuffer+1,col:l.col+(chunk?0:1)}};Parser.prototype.validateHandler=function Parser$validateHandler(handler){if(typeof handler!="object")throw new Error("Handler is not an object");if(typeof handler.reset!="function")throw new Error("Handler method 'reset' is invalid");if(typeof handler.done!="function")throw new Error("Handler method 'done' is invalid");if(typeof handler.writeTag!="function")throw new Error("Handler method 'writeTag' is invalid");if(typeof handler.writeText!="function")throw new Error("Handler method 'writeText' is invalid");if(typeof handler.writeComment!="function")throw new Error("Handler method 'writeComment' is invalid");if(typeof handler.writeDirective!="function")throw new Error("Handler method 'writeDirective' is invalid")};Parser.prototype.writeHandler=function Parser$writeHandler(forceFlush){forceFlush=!!forceFlush;if(this._tagStack.length&&!forceFlush)return;while(this._elements.length){var element=this._elements.shift();switch(element.type){case ElementType.Comment:this._handler.writeComment(element);break;case ElementType.Directive:this._handler.writeDirective(element);break;case ElementType.Text:this._handler.writeText(element);break;default:this._handler.writeTag(element);break}}};Parser.prototype.handleError=function Parser$handleError(error){if(typeof this._handler.error=="function")this._handler.error(error);else throw error};function RssHandler(callback){RssHandler.super_.call(this,callback,{ignoreWhitespace:true,verbose:false,enforceEmptyTags:false})}inherits(RssHandler,DefaultHandler);RssHandler.prototype.done=function RssHandler$done(){var feed={};var feedRoot;var found=DomUtils.getElementsByTagName(function(value){return value=="rss"||value=="feed"},this.dom,false);if(found.length){feedRoot=found[0]}if(feedRoot){if(feedRoot.name=="rss"){feed.type="rss";feedRoot=feedRoot.children[0];feed.id="";try{feed.title=DomUtils.getElementsByTagName("title",feedRoot.children,false)[0].children[0].data}catch(ex){}try{feed.link=DomUtils.getElementsByTagName("link",feedRoot.children,false)[0].children[0].data}catch(ex){}try{feed.description=DomUtils.getElementsByTagName("description",feedRoot.children,false)[0].children[0].data}catch(ex){}try{feed.updated=new Date(DomUtils.getElementsByTagName("lastBuildDate",feedRoot.children,false)[0].children[0].data)}catch(ex){}try{feed.author=DomUtils.getElementsByTagName("managingEditor",feedRoot.children,false)[0].children[0].data}catch(ex){}feed.items=[];DomUtils.getElementsByTagName("item",feedRoot.children).forEach(function(item,index,list){var entry={};try{entry.id=DomUtils.getElementsByTagName("guid",item.children,false)[0].children[0].data}catch(ex){}try{entry.title=DomUtils.getElementsByTagName("title",item.children,false)[0].children[0].data}catch(ex){}try{entry.link=DomUtils.getElementsByTagName("link",item.children,false)[0].children[0].data}catch(ex){}try{entry.description=DomUtils.getElementsByTagName("description",item.children,false)[0].children[0].data}catch(ex){}try{entry.pubDate=new Date(DomUtils.getElementsByTagName("pubDate",item.children,false)[0].children[0].data)}catch(ex){}feed.items.push(entry)})}else{feed.type="atom";try{feed.id=DomUtils.getElementsByTagName("id",feedRoot.children,false)[0].children[0].data}catch(ex){}try{feed.title=DomUtils.getElementsByTagName("title",feedRoot.children,false)[0].children[0].data}catch(ex){}try{feed.link=DomUtils.getElementsByTagName("link",feedRoot.children,false)[0].attribs.href}catch(ex){}try{feed.description=DomUtils.getElementsByTagName("subtitle",feedRoot.children,false)[0].children[0].data}catch(ex){}try{feed.updated=new Date(DomUtils.getElementsByTagName("updated",feedRoot.children,false)[0].children[0].data)}catch(ex){}try{feed.author=DomUtils.getElementsByTagName("email",feedRoot.children,true)[0].children[0].data}catch(ex){}feed.items=[];DomUtils.getElementsByTagName("entry",feedRoot.children).forEach(function(item,index,list){var entry={};try{entry.id=DomUtils.getElementsByTagName("id",item.children,false)[0].children[0].data}catch(ex){}try{entry.title=DomUtils.getElementsByTagName("title",item.children,false)[0].children[0].data}catch(ex){}try{entry.link=DomUtils.getElementsByTagName("link",item.children,false)[0].attribs.href}catch(ex){}try{entry.description=DomUtils.getElementsByTagName("summary",item.children,false)[0].children[0].data}catch(ex){}try{entry.pubDate=new Date(DomUtils.getElementsByTagName("updated",item.children,false)[0].children[0].data)}catch(ex){}feed.items.push(entry)})}this.dom=feed}RssHandler.super_.prototype.done.call(this)};function DefaultHandler(callback,options){this.reset();this._options=options?options:{};if(this._options.ignoreWhitespace==undefined)this._options.ignoreWhitespace=false;if(this._options.verbose==undefined)this._options.verbose=true;if(this._options.enforceEmptyTags==undefined)this._options.enforceEmptyTags=true;if(typeof callback=="function")this._callback=callback}DefaultHandler._emptyTags={area:1,base:1,basefont:1,br:1,col:1,frame:1,hr:1,img:1,input:1,isindex:1,link:1,meta:1,param:1,embed:1};DefaultHandler.reWhitespace=/^\s*$/;DefaultHandler.prototype.dom=null;DefaultHandler.prototype.reset=function DefaultHandler$reset(){this.dom=[];this._done=false;this._tagStack=[];this._tagStack.last=function DefaultHandler$_tagStack$last(){return this.length?this[this.length-1]:null}};DefaultHandler.prototype.done=function DefaultHandler$done(){this._done=true;this.handleCallback(null)};DefaultHandler.prototype.writeTag=function DefaultHandler$writeTag(element){this.handleElement(element)};DefaultHandler.prototype.writeText=function DefaultHandler$writeText(element){if(this._options.ignoreWhitespace)if(DefaultHandler.reWhitespace.test(element.data))return;this.handleElement(element)};DefaultHandler.prototype.writeComment=function DefaultHandler$writeComment(element){this.handleElement(element)};DefaultHandler.prototype.writeDirective=function DefaultHandler$writeDirective(element){this.handleElement(element)};DefaultHandler.prototype.error=function DefaultHandler$error(error){this.handleCallback(error)};DefaultHandler.prototype._options=null;DefaultHandler.prototype._callback=null;DefaultHandler.prototype._done=false;DefaultHandler.prototype._tagStack=null;DefaultHandler.prototype.handleCallback=function DefaultHandler$handleCallback(error){if(typeof this._callback!="function")if(error)throw error;else return;this._callback(error,this.dom)};DefaultHandler.prototype.isEmptyTag=function(element){var name=element.name.toLowerCase();if(name.charAt(0)=="/"){name=name.substring(1)}return this._options.enforceEmptyTags&&!!DefaultHandler._emptyTags[name]};DefaultHandler.prototype.handleElement=function DefaultHandler$handleElement(element){if(this._done)this.handleCallback(new Error("Writing to the handler after done() called is not allowed without a reset()"));if(!this._options.verbose){delete element.raw;if(element.type=="tag"||element.type=="script"||element.type=="style")delete element.data}if(!this._tagStack.last()){if(element.type!=ElementType.Text&&element.type!=ElementType.Comment&&element.type!=ElementType.Directive){if(element.name.charAt(0)!="/"){this.dom.push(element);if(!this.isEmptyTag(element)){this._tagStack.push(element)}}}else this.dom.push(element)}else{if(element.type!=ElementType.Text&&element.type!=ElementType.Comment&&element.type!=ElementType.Directive){if(element.name.charAt(0)=="/"){var baseName=element.name.substring(1);if(!this.isEmptyTag(element)){var pos=this._tagStack.length-1;while(pos>-1&&this._tagStack[pos--].name!=baseName){}if(pos>-1||this._tagStack[0].name==baseName)while(pos<this._tagStack.length-1)this._tagStack.pop()}}else{if(!this._tagStack.last().children)this._tagStack.last().children=[];this._tagStack.last().children.push(element);if(!this.isEmptyTag(element))this._tagStack.push(element)}}else{if(!this._tagStack.last().children)this._tagStack.last().children=[];this._tagStack.last().children.push(element)}}};var DomUtils={testElement:function DomUtils$testElement(options,element){if(!element){return false}for(var key in options){if(key=="tag_name"){if(element.type!="tag"&&element.type!="script"&&element.type!="style"){return false}if(!options["tag_name"](element.name)){return false}}else if(key=="tag_type"){if(!options["tag_type"](element.type)){return false}}else if(key=="tag_contains"){if(element.type!="text"&&element.type!="comment"&&element.type!="directive"){return false}if(!options["tag_contains"](element.data)){return false}}else{if(!element.attribs||!options[key](element.attribs[key])){return false}}}return true},getElements:function DomUtils$getElements(options,currentElement,recurse,limit){recurse=recurse===undefined||recurse===null||!!recurse;limit=isNaN(parseInt(limit))?-1:parseInt(limit);if(!currentElement){return[]}var found=[];var elementList;function getTest(checkVal){return function(value){return value==checkVal}}for(var key in options){if(typeof options[key]!="function"){options[key]=getTest(options[key])}}if(DomUtils.testElement(options,currentElement)){found.push(currentElement)}if(limit>=0&&found.length>=limit){return found}if(recurse&&currentElement.children){elementList=currentElement.children}else if(currentElement instanceof Array){elementList=currentElement}else{return found}for(var i=0;i<elementList.length;i++){found=found.concat(DomUtils.getElements(options,elementList[i],recurse,limit));if(limit>=0&&found.length>=limit){break}}return found},getElementById:function DomUtils$getElementById(id,currentElement,recurse){var result=DomUtils.getElements({id:id},currentElement,recurse,1);return result.length?result[0]:null},getElementsByTagName:function DomUtils$getElementsByTagName(name,currentElement,recurse,limit){return DomUtils.getElements({tag_name:name},currentElement,recurse,limit)},getElementsByTagType:function DomUtils$getElementsByTagType(type,currentElement,recurse,limit){return DomUtils.getElements({tag_type:type},currentElement,recurse,limit)}};function inherits(ctor,superCtor){var tempCtor=function(){};tempCtor.prototype=superCtor.prototype;ctor.super_=superCtor;ctor.prototype=new tempCtor;ctor.prototype.constructor=ctor}exports.Parser=Parser;exports.DefaultHandler=DefaultHandler;exports.RssHandler=RssHandler;exports.ElementType=ElementType;exports.DomUtils=DomUtils})()}).call(this,"/node_modules/htmlparser/lib/htmlparser.js","/node_modules/htmlparser/lib")},{}],2:[function(require,module,exports){module.exports=require("./lib/")},{"./lib/":3}],3:[function(require,module,exports){var Stringify=require("./stringify");var Parse=require("./parse");var internals={};module.exports={stringify:Stringify,parse:Parse}},{"./parse":4,"./stringify":5}],4:[function(require,module,exports){var Utils=require("./utils");var internals={delimiter:"&",depth:5,arrayLimit:20,parameterLimit:1e3};internals.parseValues=function(str,options){var obj={};var parts=str.split(options.delimiter,options.parameterLimit===Infinity?undefined:options.parameterLimit);for(var i=0,il=parts.length;i<il;++i){var part=parts[i];var pos=part.indexOf("]=")===-1?part.indexOf("="):part.indexOf("]=")+1;if(pos===-1){obj[Utils.decode(part)]=""}else{var key=Utils.decode(part.slice(0,pos));var val=Utils.decode(part.slice(pos+1));if(!obj.hasOwnProperty(key)){obj[key]=val}else{obj[key]=[].concat(obj[key]).concat(val)}}}return obj};internals.parseObject=function(chain,val,options){if(!chain.length){return val}var root=chain.shift();var obj={};if(root==="[]"){obj=[];obj=obj.concat(internals.parseObject(chain,val,options))}else{var cleanRoot=root[0]==="["&&root[root.length-1]==="]"?root.slice(1,root.length-1):root;var index=parseInt(cleanRoot,10);var indexString=""+index;if(!isNaN(index)&&root!==cleanRoot&&indexString===cleanRoot&&index>=0&&index<=options.arrayLimit){obj=[];obj[index]=internals.parseObject(chain,val,options)}else{obj[cleanRoot]=internals.parseObject(chain,val,options)}}return obj};internals.parseKeys=function(key,val,options){if(!key){return}var parent=/^([^\[\]]*)/;var child=/(\[[^\[\]]*\])/g;var segment=parent.exec(key);if(Object.prototype.hasOwnProperty(segment[1])){return}var keys=[];if(segment[1]){keys.push(segment[1])}var i=0;while((segment=child.exec(key))!==null&&i<options.depth){++i;if(!Object.prototype.hasOwnProperty(segment[1].replace(/\[|\]/g,""))){keys.push(segment[1])}}if(segment){keys.push("["+key.slice(segment.index)+"]")}return internals.parseObject(keys,val,options)};module.exports=function(str,options){if(str===""||str===null||typeof str==="undefined"){return{}}options=options||{};options.delimiter=typeof options.delimiter==="string"||Utils.isRegExp(options.delimiter)?options.delimiter:internals.delimiter;options.depth=typeof options.depth==="number"?options.depth:internals.depth;options.arrayLimit=typeof options.arrayLimit==="number"?options.arrayLimit:internals.arrayLimit;options.parameterLimit=typeof options.parameterLimit==="number"?options.parameterLimit:internals.parameterLimit;var tempObj=typeof str==="string"?internals.parseValues(str,options):str;var obj={};var keys=Object.keys(tempObj);for(var i=0,il=keys.length;i<il;++i){var key=keys[i];var newObj=internals.parseKeys(key,tempObj[key],options);obj=Utils.merge(obj,newObj)}return Utils.compact(obj)}},{"./utils":6}],5:[function(require,module,exports){var Utils=require("./utils");var internals={delimiter:"&",indices:true};internals.stringify=function(obj,prefix,options){if(Utils.isBuffer(obj)){obj=obj.toString()}else if(obj instanceof Date){obj=obj.toISOString()}else if(obj===null){obj=""}if(typeof obj==="string"||typeof obj==="number"||typeof obj==="boolean"){return[encodeURIComponent(prefix)+"="+encodeURIComponent(obj)]}var values=[];if(typeof obj==="undefined"){return values}var objKeys=Object.keys(obj);for(var i=0,il=objKeys.length;i<il;++i){var key=objKeys[i];if(!options.indices&&Array.isArray(obj)){values=values.concat(internals.stringify(obj[key],prefix,options))}else{values=values.concat(internals.stringify(obj[key],prefix+"["+key+"]",options))}}return values};module.exports=function(obj,options){options=options||{};var delimiter=typeof options.delimiter==="undefined"?internals.delimiter:options.delimiter;options.indices=typeof options.indices==="boolean"?options.indices:internals.indices;var keys=[];if(typeof obj!=="object"||obj===null){return""}var objKeys=Object.keys(obj);for(var i=0,il=objKeys.length;i<il;++i){var key=objKeys[i];keys=keys.concat(internals.stringify(obj[key],key,options))}return keys.join(delimiter)}},{"./utils":6}],6:[function(require,module,exports){var internals={};exports.arrayToObject=function(source){var obj={};for(var i=0,il=source.length;i<il;++i){if(typeof source[i]!=="undefined"){obj[i]=source[i]}}return obj};exports.merge=function(target,source){if(!source){return target}if(typeof source!=="object"){if(Array.isArray(target)){target.push(source)}else{target[source]=true}return target}if(typeof target!=="object"){target=[target].concat(source);return target}if(Array.isArray(target)&&!Array.isArray(source)){target=exports.arrayToObject(target)}var keys=Object.keys(source);for(var k=0,kl=keys.length;k<kl;++k){var key=keys[k];var value=source[key];if(!target[key]){target[key]=value}else{target[key]=exports.merge(target[key],value)}}return target};exports.decode=function(str){try{return decodeURIComponent(str.replace(/\+/g," "))}catch(e){return str}};exports.compact=function(obj,refs){if(typeof obj!=="object"||obj===null){return obj}refs=refs||[];var lookup=refs.indexOf(obj);if(lookup!==-1){return refs[lookup]}refs.push(obj);if(Array.isArray(obj)){var compacted=[];for(var i=0,il=obj.length;i<il;++i){if(typeof obj[i]!=="undefined"){compacted.push(obj[i])}}return compacted}var keys=Object.keys(obj);for(i=0,il=keys.length;i<il;++i){var key=keys[i];obj[key]=exports.compact(obj[key],refs)}return obj};exports.isRegExp=function(obj){return Object.prototype.toString.call(obj)==="[object RegExp]"};exports.isBuffer=function(obj){if(obj===null||typeof obj==="undefined"){return false}return!!(obj.constructor&&obj.constructor.isBuffer&&obj.constructor.isBuffer(obj))}},{}],7:[function(require,module,exports){var extractClickURL=require("./extractClickURL.js"),cleanAd=function(ad){var cleaned;if(ad.indexOf("</html>")>0){cleaned=ad}else if(ad.indexOf("</body>")>0){cleaned=["<html>",ad,"</html>"].join("\n")}else{cleaned=["<html><body style='margin:0px;padding:0px;'>",ad,"</body></html>"].join("\n")}return cleaned};module.exports={createBanner:function(ad,ad_id,confElement,mobfoxClickURL){var iframe=document.getElementById(ad_id);if(iframe){iframe.parentNode.removeChild(iframe)}containerDiv=document.createElement("div");containerDiv.style.margin="0px";containerDiv.style.padding="0px";containerDiv.style.border="none";containerDiv.style.cursor="pointer";containerDiv.id="container_"+ad_id;confElement.parentNode.insertBefore(containerDiv,confElement);var cleaned=cleanAd(ad.content);extractClickURL(cleaned,function(err,clickURL){containerDiv.onclick=function(){if(!clickURL){window.location.href=ad.url;return}var registerMobfoxClick=document.createElement("script");registerMobfoxClick.src=ad.url;registerMobfoxClick.onload=registerMobfoxClick.onerror=function(){window.location.href=clickURL};document.body.appendChild(registerMobfoxClick)};iframe=document.createElement("iframe");iframe.id=ad_id;iframe.className="mobfox_iframe";iframe.width=mobfoxConfig.width;iframe.height=mobfoxConfig.height;iframe.style.pointerEvents="none";iframe.src="data:text/html;charset=utf-8,"+cleaned;containerDiv.appendChild(iframe);iframe.style.margin="0px";iframe.style.padding="0px";iframe.style.border="none";iframe.scrolling="no";iframe.style.overflow="hidden"})},createInterstitial:function(ad,ad_id,confElement,timeout){var adContainer=document.getElementById("mobfox_interstitial");if(adContainer){adContainer.parentNode.removeChild(iframe)}adContainer=document.createElement("iframe");adContainer.id="mobfox_interstitial";adContainer.style.width=window.innerWidth+"px";adContainer.style.height=window.innerHeight+"px";adContainer.style.zIndex="1000000";adContainer.style.backgroundColor="transparent";adContainer.style.position="fixed";adContainer.style.left="0px";adContainer.style.top="0px";adContainer.style.margin="0px";adContainer.style.padding="0px";adContainer.style.border="none";document.body.appendChild(adContainer);adContainer.contentWindow.document.body.style.margin="0px";var iframe=adContainer.contentWindow.document.createElement("iframe");iframe.id=ad_id;iframe.className="mobfox_iframe";iframe.width=mobfoxConfig.width;iframe.height=mobfoxConfig.height;iframe.src="data:text/html;charset=utf-8, "+escape(cleanAd(ad.content));adContainer.contentWindow.document.body.appendChild(iframe);iframe.style.margin="0px auto";iframe.style.padding="0px";iframe.style.border="none";iframe.style.display="block";iframe.scrolling="no";iframe.style.overflow="hidden";var button=adContainer.contentWindow.document.createElement("canvas");adContainer.contentWindow.document.body.appendChild(button);button.onclick=function(){adContainer.parentNode.removeChild(adContainer)};button.style.position="absolute";button.style.width="40px";button.style.height="40px";button.style.top="10px";button.style.right="10px";button.width=40;button.height=40;button.style.cursor="pointer";button.id="mobfox_dismiss";var ctx=button.getContext("2d");ctx.rect(0,0,40,40);ctx.fillStyle="#fff";ctx.fill();ctx.strokeStyle="#000";ctx.lineWidth=4;ctx.rect(0,0,40,40);ctx.stroke();ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(10,10);ctx.lineTo(30,30);ctx.moveTo(10,30);ctx.lineTo(30,10);ctx.stroke();setTimeout(function(){adContainer.parentNode.removeChild(adContainer)},timeout||16e3)},createFloating:function(ad,ad_id,confElement){var adContainer=document.getElementById("mobfox_floating");if(adContainer){adContainer.parentNode.removeChild(iframe)}adContainer=document.createElement("iframe");adContainer.id="mobfox_floating";adContainer.style.width=mobfoxConfig.width+"px";adContainer.style.height=mobfoxConfig.height+"px";adContainer.style.zIndex="1000000";adContainer.style.position="fixed";adContainer.style.bottom="0px";adContainer.style.margin="0px";adContainer.style.padding="0px";adContainer.style.border="none";document.body.appendChild(adContainer);adContainer.contentWindow.document.body.style.margin="0px";var iframe=adContainer.contentWindow.document.createElement("iframe");iframe.id=ad_id;iframe.className="mobfox_iframe";iframe.width=mobfoxConfig.width;iframe.height=mobfoxConfig.height;iframe.src="data:text/html;charset=utf-8, "+escape(cleanAd(ad.content));adContainer.contentWindow.document.body.appendChild(iframe);adContainer.style.left=(window.innerWidth-parseInt(adContainer.style.width))/2+"px";iframe.style.margin="0px auto";iframe.style.padding="0px";iframe.style.border="none";iframe.style.display="block";iframe.scrolling="no";iframe.style.overflow="hidden";if(mobfoxConfig.closeButton===false)return;var button=adContainer.contentWindow.document.createElement("canvas");adContainer.contentWindow.document.body.appendChild(button);button.onclick=function(){adContainer.parentNode.removeChild(adContainer)};button.style.position="absolute";button.style.width="20px";button.style.height="20px";button.style.top="5px";button.style.right="5px";button.width=40;button.height=40;button.style.cursor="pointer";button.id="mobfox_dismiss";var ctx=button.getContext("2d");ctx.rect(0,0,40,40);ctx.fillStyle="#fff";ctx.fill();ctx.strokeStyle="#000";ctx.lineWidth=4;ctx.rect(0,0,40,40);ctx.stroke();ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(10,10);ctx.lineTo(30,30);ctx.moveTo(10,30);ctx.lineTo(30,10);ctx.stroke()}}},{"./extractClickURL.js":8}],8:[function(require,module,exports){var htmlparser=require("htmlparser");module.exports=function(html,cb){var handler=new htmlparser.DefaultHandler(function(error,dom){var nodes=dom,node=nodes.filter(function(n){return n.name==="html"})[0];if(node.name!=="body"){node=node.children.filter(function(n){return n.name==="body"})[0]}if(node.attribs&&node.attribs.onclick){var m=node.attribs.onclick.match(/^gotourl\(\'(.*)\'\)$/);if(m)return cb(null,m[1])}if(node.attribs&&node.attribs["data-clickurl"]){return cb(null,node.attribs["data-clickurl"])}cb()});var parser=new htmlparser.Parser(handler);parser.parseComplete(html)}},{htmlparser:1}],9:[function(require,module,exports){(function(){var Qs=require("qs"),ads=require("./ads.js"),confE=document.getElementById("mobfoxConfig"),mobfoxVar="mobfox_"+String(Math.random()).slice(2),refreshInterval,createAd={banner:ads.createBanner,interstitial:ads.createInterstitial,floating:ads.createFloating};function retrieve(){var script=document.createElement("script"),options=["o_androidid","o_androidimei","o_iosadvid","o_andadvid","longitude","latitude","demo.gender","demo.keyword","demo.age","adspace.strict","no_markup","s_subid","allow_mr","r_floor","testURL"],params={r_type:"banner",u:window.navigator.userAgent,s:mobfoxConfig.publicationID,p:window.location.href,m:mobfoxConfig.debug?"test":"live",rt:"javascript",v:"3.0","adspace.width":mobfoxConfig.width,"adspace.height":mobfoxConfig.height,timeout:mobfoxConfig.timeout,jsvar:mobfoxVar};
options.forEach(function(o){if(typeof mobfoxConfig[o]!=="undefined"){params[o]=mobfoxConfig[o]}});if(params.testURL){params.jsvar=mobfoxVar="mobfox_test"}confE.parentNode.insertBefore(script,confE);var url=params.testURL||"http://my.mobfox.com/request.php";script.src=url+"?"+Qs.stringify(params);script.onload=function(){if(!window[mobfoxVar]){window.clearInterval(refreshInterval);script.parentNode.removeChild(script);if(mobfoxConfig.passback){if(typeof mobfoxConfig.passback==="function"){mobfoxConfig.passback()}else if(typeof mobfoxConfig.passback==="string"){eval(mobfoxConfig.passback+"()")}}return}createAd[mobfoxConfig.type](window[mobfoxVar][0],mobfoxVar,confE,params.timeout);script.parentNode.removeChild(script)}}if(mobfoxConfig.refresh){refreshInterval=setInterval(retrieve,mobfoxConfig.refresh)}retrieve()})()},{"./ads.js":7,qs:2}]},{},[9]);