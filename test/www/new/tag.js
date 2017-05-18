(function e$$0(m,q,d){function h(b,k){if(!q[b]){if(!m[b]){var f="function"==typeof require&&require;if(!k&&f)return f(b,!0);if(g)return g(b,!0);f=Error("Cannot find module '"+b+"'");throw f.code="MODULE_NOT_FOUND",f;}f=q[b]={exports:{}};m[b][0].call(f.exports,function(f){var g=m[b][1][f];return h(g?g:f)},f,f.exports,e$$0,m,q,d)}return q[b].exports}for(var g="function"==typeof require&&require,b=0;b<d.length;b++)h(d[b]);return h})({1:[function(p,m,q){function d(h){if(h){for(var g in d.prototype)h[g]=
d.prototype[g];return h}}m.exports=d;d.prototype.on=d.prototype.addEventListener=function(h,g){this._callbacks=this._callbacks||{};(this._callbacks[h]=this._callbacks[h]||[]).push(g);return this};d.prototype.once=function(h,g){function b(){d.off(h,b);g.apply(this,arguments)}var d=this;this._callbacks=this._callbacks||{};b.fn=g;this.on(h,b);return this};d.prototype.off=d.prototype.removeListener=d.prototype.removeAllListeners=d.prototype.removeEventListener=function(h,g){this._callbacks=this._callbacks||
{};if(0==arguments.length)return this._callbacks={},this;var b=this._callbacks[h];if(!b)return this;if(1==arguments.length)return delete this._callbacks[h],this;for(var d,k=0;k<b.length;k++)if(d=b[k],d===g||d.fn===g){b.splice(k,1);break}return this};d.prototype.emit=function(d){this._callbacks=this._callbacks||{};var g=[].slice.call(arguments,1),b=this._callbacks[d];if(b)for(var b=b.slice(0),n=0,k=b.length;n<k;++n)b[n].apply(this,g);return this};d.prototype.listeners=function(d){this._callbacks=this._callbacks||
{};return this._callbacks[d]||[]};d.prototype.hasListeners=function(d){return!!this.listeners(d).length}},{}],2:[function(p,m,q){function d(d){var b=function(){if(b.called)return b.value;b.called=!0;return b.value=d.apply(this,arguments)};b.called=!1;return b}function h(d){var b=function(){if(b.called)throw Error(b.onceError);b.called=!0;return b.value=d.apply(this,arguments)};b.onceError=(d.name||"Function wrapped with `once`")+" shouldn't be called more than once";b.called=!1;return b}p=p("wrappy");
m.exports=p(d);m.exports.strict=p(h);d.proto=d(function(){Object.defineProperty(Function.prototype,"once",{value:function(){return d(this)},configurable:!0});Object.defineProperty(Function.prototype,"onceStrict",{value:function(){return h(this)},configurable:!0})})},{wrappy:5}],3:[function(p,m,q){m.exports=function(d,h,g){for(var b=0,n=d.length,k=3==arguments.length?g:d[b++];b<n;)k=h.call(null,k,d[b],++b,d);return k}},{}],4:[function(p,m,q){function d(){}function h(){if(!r.XMLHttpRequest||"file:"==
r.location.protocol&&r.ActiveXObject){try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(a){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0")}catch(a){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0")}catch(a){}try{return new ActiveXObject("Msxml2.XMLHTTP")}catch(a){}}else return new XMLHttpRequest;return!1}function g(a){if(a!==Object(a))return a;var c=[],e;for(e in a)null!=a[e]&&c.push(encodeURIComponent(e)+"="+encodeURIComponent(a[e]));return c.join("&")}function b(a){var c={};a=a.split("&");
for(var e,b=0,d=a.length;b<d;++b)e=a[b],e=e.split("="),c[decodeURIComponent(e[0])]=decodeURIComponent(e[1]);return c}function n(a){return u(a.split(/ *; */),function(a,e){var b=e.split(/ *= */),d=b.shift(),b=b.shift();d&&b&&(a[d]=b);return a},{})}function k(a,c){this.req=a;this.xhr=this.req.xhr;this.text="HEAD"!=this.req.method?this.xhr.responseText:null;this.setStatusProperties(this.xhr.status);var e=this.xhr.getAllResponseHeaders().split(/\r?\n/),b={},d,f,h;e.pop();for(var g=0,l=e.length;g<l;++g)f=
e[g],d=f.indexOf(":"),h=f.slice(0,d).toLowerCase(),d=v(f.slice(d+1)),b[h]=d;this.header=this.headers=b;this.header["content-type"]=this.xhr.getResponseHeader("content-type");this.setHeaderProperties(this.header);this.body="HEAD"!=this.req.method?this.parseBody(this.text):null}function f(a,c){var e=this;t.call(this);this._query=this._query||[];this.method=a;this.url=c;this.header={};this._header={};this.on("end",function(){var a=null,c=null;try{c=new k(e)}catch(b){a=Error("Parser is unable to parse the response"),
a.parse=!0,a.original=b}e.callback(a,c)})}function l(a,c){return"function"==typeof c?(new f("GET",a)).end(c):1==arguments.length?new f("GET",a):new f(a,c)}var t=p("emitter"),u=p("reduce"),r="undefined"==typeof window?this:window,v="".trim?function(a){return a.trim()}:function(a){return a.replace(/(^\s*|\s*$)/g,"")};l.serializeObject=g;l.parseString=b;l.types={html:"text/html",json:"application/json",xml:"application/xml",urlencoded:"application/x-www-form-urlencoded",form:"application/x-www-form-urlencoded",
"form-data":"application/x-www-form-urlencoded"};l.serialize={"application/x-www-form-urlencoded":g,"application/json":JSON.stringify};l.parse={"application/x-www-form-urlencoded":b,"application/json":JSON.parse};k.prototype.get=function(a){return this.header[a.toLowerCase()]};k.prototype.setHeaderProperties=function(a){a=this.header["content-type"]||"";this.type=a.split(/ *; */).shift();a=n(a);for(var c in a)this[c]=a[c]};k.prototype.parseBody=function(a){var c=l.parse[this.type];return c&&a&&a.length?
c(a):null};k.prototype.setStatusProperties=function(a){var c=a/100|0;this.status=a;this.statusType=c;this.info=1==c;this.ok=2==c;this.clientError=4==c;this.serverError=5==c;this.error=4==c||5==c?this.toError():!1;this.accepted=202==a;this.noContent=204==a||1223==a;this.badRequest=400==a;this.unauthorized=401==a;this.notAcceptable=406==a;this.notFound=404==a;this.forbidden=403==a};k.prototype.toError=function(){var a=this.req,c=a.method,a=a.url,e=Error("cannot "+c+" "+a+" ("+this.status+")");e.status=
this.status;e.method=c;e.url=a;return e};l.Response=k;t(f.prototype);f.prototype.use=function(a){a(this);return this};f.prototype.timeout=function(a){this._timeout=a;return this};f.prototype.clearTimeout=function(){this._timeout=0;clearTimeout(this._timer);return this};f.prototype.abort=function(){if(!this.aborted)return this.aborted=!0,this.xhr.abort(),this.clearTimeout(),this.emit("abort"),this};f.prototype.set=function(a,c){if(a===Object(a)){for(var e in a)this.set(e,a[e]);return this}this._header[a.toLowerCase()]=
c;this.header[a]=c;return this};f.prototype.unset=function(a){delete this._header[a.toLowerCase()];delete this.header[a];return this};f.prototype.getHeader=function(a){return this._header[a.toLowerCase()]};f.prototype.type=function(a){this.set("Content-Type",l.types[a]||a);return this};f.prototype.accept=function(a){this.set("Accept",l.types[a]||a);return this};f.prototype.auth=function(a,c){var e=btoa(a+":"+c);this.set("Authorization","Basic "+e);return this};f.prototype.query=function(a){"string"!=
typeof a&&(a=g(a));a&&this._query.push(a);return this};f.prototype.field=function(a,c){this._formData||(this._formData=new FormData);this._formData.append(a,c);return this};f.prototype.attach=function(a,c,e){this._formData||(this._formData=new FormData);this._formData.append(a,c,e);return this};f.prototype.send=function(a){var c=a===Object(a),e=this.getHeader("Content-Type"),b;if(b=c)b=this._data,b=b===Object(b);if(b)for(var d in a)this._data[d]=a[d];else"string"==typeof a?(e||this.type("form"),e=
this.getHeader("Content-Type"),this._data="application/x-www-form-urlencoded"==e?this._data?this._data+"&"+a:a:(this._data||"")+a):this._data=a;if(!c)return this;e||this.type("json");return this};f.prototype.callback=function(a,c){var e=this._callback;this.clearTimeout();if(2==e.length)return e(a,c);if(a)return this.emit("error",a);e(c)};f.prototype.crossDomainError=function(){var a=Error("Origin is not allowed by Access-Control-Allow-Origin");a.crossDomain=!0;this.callback(a)};f.prototype.timeoutError=
function(){var a=this._timeout,c=Error("timeout of "+a+"ms exceeded");c.timeout=a;this.callback(c)};f.prototype.withCredentials=function(){this._withCredentials=!0;return this};f.prototype.end=function(a){var c=this,e=this.xhr=h(),b=this._query.join("&"),f=this._timeout,g=this._formData||this._data;this._callback=a||d;e.onreadystatechange=function(){if(4==e.readyState){if(0==e.status)return c.aborted?c.timeoutError():c.crossDomainError();c.emit("end")}};e.upload&&(e.upload.onprogress=function(a){a.percent=
a.loaded/a.total*100;c.emit("progress",a)});f&&!this._timer&&(this._timer=setTimeout(function(){c.abort()},f));b&&(b=l.serializeObject(b),this.url+=~this.url.indexOf("?")?"&"+b:"?"+b);e.open(this.method,this.url,!0);this._withCredentials&&(e.withCredentials=!0);if(a="GET"!=this.method&&"HEAD"!=this.method&&"string"!=typeof g){a:switch({}.toString.call(g)){case "[object File]":case "[object Blob]":case "[object FormData]":a=!0;break a;default:a=!1}a=!a}a&&(a=l.serialize[this.getHeader("Content-Type")])&&
(g=a(g));for(var k in this.header)null!=this.header[k]&&e.setRequestHeader(k,this.header[k]);this.emit("request",this);e.send(g);return this};l.Request=f;l.get=function(a,c,b){a=l("GET",a);"function"==typeof c&&(b=c,c=null);c&&a.query(c);b&&a.end(b);return a};l.head=function(a,c,b){a=l("HEAD",a);"function"==typeof c&&(b=c,c=null);c&&a.send(c);b&&a.end(b);return a};l.del=function(a,c){var b=l("DELETE",a);c&&b.end(c);return b};l.patch=function(a,c,b){a=l("PATCH",a);"function"==typeof c&&(b=c,c=null);
c&&a.send(c);b&&a.end(b);return a};l.post=function(a,b,e){a=l("POST",a);"function"==typeof b&&(e=b,b=null);b&&a.send(b);e&&a.end(e);return a};l.put=function(a,b,e){a=l("PUT",a);"function"==typeof b&&(e=b,b=null);b&&a.send(b);e&&a.end(e);return a};m.exports=l},{emitter:1,reduce:3}],5:[function(p,m,q){function d(h,g){function b(){for(var b=Array(arguments.length),d=0;d<b.length;d++)b[d]=arguments[d];var f=h.apply(this,b),g=b[b.length-1];"function"===typeof f&&f!==g&&Object.keys(g).forEach(function(b){f[b]=
g[b]});return f}if(h&&g)return d(h)(g);if("function"!==typeof h)throw new TypeError("need wrapper function");Object.keys(h).forEach(function(d){b[d]=h[d]});return b}m.exports=d},{}],6:[function(p,m,q){var d=p("superagent"),h=p("once"),g=document.currentScript,b=!1,n=!1,k=function(b){if("function"===typeof mobFoxParams.onFail)mobFoxParams.onFail(b)},f=function(){if("function"===typeof mobFoxParams.onSuccess)mobFoxParams.onSuccess()},l=function(b){var a=b.request.htmlString;(b=b.request.htmlString.match(new RegExp(/var markupB64\s*=\s*[\"\'](.*?)[\"\']/m)))&&
(a=window.atob(b[1]));return a},t=function(b){try{var a=document.createElement("div");a.id="mobfoxDiv";g&&"head"!==g.parentNode.tagName.toLowerCase()?g.parentNode.appendChild(a):document.body.appendChild(a);a.style.border="none";a.style.width=mobFoxParams.adspace_width+"px";a.style.height=mobFoxParams.adspace_height+"px";a.style.overflow="hidden";a.style.margin="0px";a.style.padding="0px";a.style.display="inline-block";var c=l(b);a.innerHTML=c;n=!0;f()}catch(d){n=!0,k({e1:d})}},u=function(d){try{var a=
document.createElement("iframe");a.id="mobfoxFrame";g&&"head"!==g.parentNode.tagName.toLowerCase()?g.parentNode.appendChild(a):document.body.appendChild(a);a.frameborder="0";a.style.border="none";a.style.width=mobFoxParams.adspace_width+"px";a.style.height=mobFoxParams.adspace_height+"px";a.style.overflow="hidden";a.style.margin="none";a.setAttribute("scrolling","no");var c=l(d),c=0>c.indexOf("<html>")?["<html><body style='margin:0px;padding:0px;'>",c,"</body></html>"].join("\n"):c+"<style>body{margin:0px;padding:0px}</style>";
a.onload=h(function(){b||(n=!0,f())});var e=a.contentWindow||a.contentDocument.document||a.contentDocument;e.document.open();e.document.write(c);e.document.close()}catch(m){n=!0,k({e2:m})}};mobFoxParams.u=navigator.userAgent;mobFoxParams.r_resp="json";mobFoxParams.rt="api-fetchip";mobFoxParams.r_type="banner";console.log("blah");var r="http://my.mobfox.com/request.php";try{1==mobFoxParams.imp_secure&&(r="https://my.mobfox.com/request.php")}catch(v){}h(function(){window.setTimeout(function(){b=!0;
n||k("timeout")},3E3);d.get(r).timeout(2500).query(mobFoxParams).end(h(function(d,a){if(!b)try{var c=a||d.error||!d.body||d.body.error;if(c)return n=!0,k({e3:c});var e=d.body;document.body?mobFoxParams.noIFrame?t(e):u(e):document.addEventListener("DOMContentLoaded",function(){mobFoxParams.noIFrame?t(e):u(e)})}catch(f){n=!0,k({e4:f})}}))})()},{once:2,superagent:4}]},{},[6]);
