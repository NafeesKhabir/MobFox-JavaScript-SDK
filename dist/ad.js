(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){var cleanAd=function(ad){var cleaned;if(ad.indexOf("<iframe")>=0){cleaned=ad}else if(ad.indexOf("</html>")>0){cleaned=ad}else if(ad.indexOf("</body>")>0){cleaned=["<html>",ad,"</html>"].join("\n")}else{cleaned=["<html><body style='margin:0px;padding:0px;'>",ad,"</body></html>"].join("\n")}return cleaned};function addCloseButton(div,options){options=options||{};var button=document.createElement("canvas");div.appendChild(button);button.onclick=function(){div.parentNode.removeChild(div)};button.style.position="absolute";button.style.width=(options.width||40)+"px";button.style.height=(options.height||40)+"px";button.style.top=(options.top||10)+"px";button.style.right=(options.right||10)+"px";button.width=40;button.height=40;button.style.cursor="pointer";button.id="mobfox_dismiss";var ctx=button.getContext("2d");ctx.rect(0,0,40,40);ctx.fillStyle="#fff";ctx.fill();ctx.strokeStyle="#000";ctx.lineWidth=4;ctx.rect(0,0,40,40);ctx.stroke();ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(10,10);ctx.lineTo(30,30);ctx.moveTo(10,30);ctx.lineTo(30,10);ctx.stroke()}function createOnClickCallback(mobfoxClickURL,starboltClickURL){return function(){if(!starboltClickURL)return true;var anchor=document.createElement("a");anchor.href=starboltClickURL||mobfoxClickURL;anchor.target="_top";document.body.appendChild(anchor);var evt=document.createEvent("MouseEvents");evt.initMouseEvent("click",true,true,window,0,0,0,0,0,false,false,false,false,0,null);if(!starboltClickURL){anchor.dispatchEvent(evt);return}var registerMobfoxClick=document.createElement("script");registerMobfoxClick.src=mobfoxClickURL;registerMobfoxClick.onload=registerMobfoxClick.onerror=function(){anchor.dispatchEvent(evt)};document.body.appendChild(registerMobfoxClick)}}function writeToIFrame(iframe,html){if(iframe.mobfoxLoaded)return;var iframeWin=iframe.contentWindow?iframe.contentWindow:iframe.contentDocument.document?iframe.contentDocument.document:iframe.contentDocument;iframeWin.document.open();iframeWin.document.write(html);iframeWin.document.close();iframe.sandbox="allow-top-navigation allow-popups allow-scripts";iframe.mobfoxLoaded=true}module.exports={createBanner:function(ad,ad_id,confElement,mobfoxConfig){var iframe=document.getElementById(ad_id);if(iframe){iframe.parentNode.removeChild(iframe)}var containerDiv=document.createElement("div");containerDiv.style.margin="0px";containerDiv.style.padding="0px";containerDiv.style.border="none";containerDiv.style.cursor="pointer";containerDiv.id="container_"+ad_id;if(confElement.parentNode&&confElement.parentNode.tagName.toLowerCase()==="head"){confElement=document.body;confElement.appendChild(containerDiv)}else{confElement.parentNode.insertBefore(containerDiv,confElement)}var cleaned=cleanAd(ad.content);iframe=document.createElement("iframe");iframe.id=ad_id;iframe.className="mobfox_iframe";iframe.width=mobfoxConfig.width;iframe.height=mobfoxConfig.height;iframe.onload=function(){writeToIFrame(iframe,cleaned)};containerDiv.appendChild(iframe);iframe.style.margin="0px";iframe.style.padding="0px";iframe.style.border="none";iframe.scrolling="no";iframe.style.overflow="hidden"},createInterstitial:function(ad,ad_id,confElement,mobfoxConfig){if(mobfoxConfig.debug){mobfoxConfig.timeout=5e5}if(confElement.parentNode&&confElement.parentNode.tagName.toLowerCase()==="head"){confElement=document.body}var adContainer=document.getElementById("mobfox_interstitial");if(adContainer){adContainer.parentNode.removeChild(iframe)}adContainer=document.createElement("div");adContainer.id="mobfox_interstitial";adContainer.style.width=window.innerWidth+"px";adContainer.style.height=window.innerHeight+"px";adContainer.style.zIndex="1000000";adContainer.style.backgroundColor="transparent";adContainer.style.position="fixed";adContainer.style.left="0px";adContainer.style.top="0px";adContainer.style.margin="0px";adContainer.style.padding="0px";adContainer.style.border="none";document.body.appendChild(adContainer);var cleaned=cleanAd(ad.content);var containerDiv=document.createElement("div");containerDiv.style.margin="0px";containerDiv.style.padding="0px";containerDiv.style.border="none";containerDiv.style.cursor="pointer";containerDiv.id="container_"+ad_id;adContainer.appendChild(containerDiv);var iframe=document.createElement("iframe");iframe.id=ad_id;iframe.className="mobfox_iframe";iframe.width=mobfoxConfig.width;iframe.height=mobfoxConfig.height;iframe.onload=function(){writeToIFrame(iframe,cleaned)};containerDiv.appendChild(iframe);iframe.style.margin="0px auto";iframe.style.padding="0px";iframe.style.border="none";iframe.style.display="block";iframe.scrolling="no";iframe.style.overflow="hidden";addCloseButton(adContainer);setTimeout(function(){adContainer.parentNode.removeChild(adContainer)},mobfoxConfig.timeout||16e3)},createFloating:function(ad,ad_id,confElement,mobfoxConfig){if(confElement.parentNode&&confElement.parentNode.tagName.toLowerCase()==="head"){confElement=document.body}var adContainer=document.getElementById("mobfox_floating");if(adContainer){adContainer.parentNode.removeChild(iframe)}adContainer=document.createElement("div");adContainer.id="mobfox_floating";adContainer.style.width=mobfoxConfig.width+"px";adContainer.style.height=mobfoxConfig.height+"px";adContainer.style.zIndex="1000000";adContainer.style.position="fixed";adContainer.style.bottom="0px";adContainer.style.margin="0px";adContainer.style.padding="0px";adContainer.style.border="none";document.body.appendChild(adContainer);var cleaned=cleanAd(ad.content);var containerDiv=document.createElement("div");containerDiv.style.margin="0px";containerDiv.style.padding="0px";containerDiv.style.border="none";containerDiv.style.cursor="pointer";containerDiv.id="container_"+ad_id;adContainer.appendChild(containerDiv);var iframe=document.createElement("iframe");iframe.id=ad_id;iframe.className="mobfox_iframe";iframe.width=mobfoxConfig.width;iframe.height=mobfoxConfig.height;adContainer.style.left=(window.innerWidth-parseInt(adContainer.style.width))/2+"px";iframe.style.margin="0px auto";iframe.style.padding="0px";iframe.style.border="none";iframe.style.display="block";iframe.scrolling="no";iframe.style.overflow="hidden";if(mobfoxConfig.closeButton===false)return;iframe.onload=function(){writeToIFrame(iframe,cleaned)};containerDiv.appendChild(iframe);addCloseButton(adContainer,{width:20,height:20,top:5,right:5})}}},{}],2:[function(require,module,exports){module.exports=function(window,refE,passback,options,cb){var iframe=window.document.createElement("iframe");iframe.onload=function(){if(iframe.passbackLoaded)return;var iframeWin=iframe.contentWindow?iframe.contentWindow:iframe.contentDocument.document?iframe.contentDocument.document:iframe.contentDocument;iframeWin.document.open();iframeWin.document.write(decodeURIComponent(passback));iframeWin.document.close();iframe.sandbox="allow-top-navigation allow-popups allow-scripts";iframe.passbackLoaded=true};if(options.confID){refE=options.confID.match(/^\d+$/)?document.querySelector("#mobfoxConf_"+options.confID):document.querySelector("#"+options.confID);if(refE.parentNode===document.head){document.body.appendChild(iframe)}else{refE.parentNode.insertBefore(iframe,refE)}}else if(refE){refE.parentNode.insertBefore(iframe,refE)}else{window.document.body.appendChild(iframe)}iframe.style.width=options.width+"px";iframe.style.height=options.height+"px";iframe.style.margin="0px";iframe.style.border="none";iframe.style.overflowY="hidden";iframe.frameBorder=0;iframe.seamless="seamless";iframe.scrolling="no"}},{}],3:[function(require,module,exports){(function(){var Qs=require("./query-string"),URL=require("./lite-url").liteURL,ads=require("./ads.js"),appendPassback=require("./appendPassback.js"),curScript=document.currentScript||function(){var scripts=document.getElementsByTagName("script");return scripts[scripts.length-1]}(),confE=curScript&&curScript.previousElementSibling,confMatch=curScript&&curScript.src.match(/conf_id=(\d+)/),confID=confMatch&&confMatch[1],mobfoxVar="mobfox_"+String(Math.random()).slice(2),createAd={banner:ads.createBanner,interstitial:ads.createInterstitial,floating:ads.createFloating},refreshInterval;var mobfoxConfig=URL(curScript.src).params;if(mobfoxConfig){confE=curScript}if(!mobfoxConfig||!mobfoxConfig.publicationID&&!mobfoxConfig.pid){if(confID){mobfoxConfig=window.mobfoxConfig[confID];confE=document.querySelector("#mobfoxConf_"+confID)}else if(curScript.dataset.mobfoxconf){confID=curScript.dataset.mobfoxconf;mobfoxConfig=window.mobfoxConfig[confID];confE=document.querySelector("#"+confID)}else{if(!confE||confE.className.indexOf("mobfoxConfig")<0){confE=document.querySelector(".mobfoxConfig");if(!confE){confE=document.querySelector("#mobfoxConfig")}}if(confE.innerHTML){eval(confE.innerHTML)}mobfoxConfig=window.mobfoxConfig}}function retrieve(){var script=document.createElement("script"),options=["o_androidid","o_androidimei","o_iosadvid","o_andadvid","longitude","latitude","demo.gender","demo.keyword","demo.age","adspace_strict","no_markup","s_subid","allow_mr","r_floor","testURL"],params={r_type:"banner",u:window.navigator.userAgent,s:mobfoxConfig.publicationID||mobfoxConfig.pid,p:window.location.href,m:mobfoxConfig.debug?"test":"live",rt:"javascript",v:"3.0",adspace_width:mobfoxConfig.width,adspace_height:mobfoxConfig.height,timeout:mobfoxConfig.timeout,jsvar:mobfoxVar};options.forEach(function(o){if(typeof mobfoxConfig[o]!=="undefined"){params[o]=mobfoxConfig[o]}});if(params.testURL){if(!window.mobfoxCount)window.mobfoxCount=1;params.jsvar=mobfoxVar="mobfox_test"+(window.mobfoxCount>1?window.mobfoxCount:"");window.mobfoxCount++}var w=parseInt(params.adspace_width),h=parseInt(params.adspace_height);if(w!=w||w<0)throw"Invalid adspace_width: "+params.adspace_width;if(h!=h||h<0)throw"Invalid adspace_height: "+params.adspace_height;var url=params.testURL||"http://my.mobfox.com/request.php";script.type="text/javascript";script.onload=script.onerror=function(){script.parentNode.removeChild(script);if(!window[mobfoxVar]){window.clearInterval(refreshInterval);if(mobfoxConfig.passback){if(typeof mobfoxConfig.passback==="function"){mobfoxConfig.passback()}else if(typeof mobfoxConfig.passback==="string"){appendPassback(window,confE,mobfoxConfig.passback,{width:mobfoxConfig.width,height:mobfoxConfig.height,confID:confID},function(err){})}}return}mobfoxConfig.timeout=params.timeout;createAd[mobfoxConfig.type](window[mobfoxVar][0],mobfoxVar,confE,mobfoxConfig)};script.src=url+"?"+Qs.stringify(params);document.head.appendChild(script)}if(mobfoxConfig.refresh){refreshInterval=setInterval(retrieve,mobfoxConfig.refresh)}retrieve()})()},{"./ads.js":1,"./appendPassback.js":2,"./lite-url":4,"./query-string":5}],4:[function(require,module,exports){var memo={};function splitOnFirst(str,splitter,callback){var parts=str.split(splitter);var first=parts.shift();return callback(first,parts.join(splitter))}function uriParser(str){var uri={hash:"",host:"",hostname:"",origin:"",pathname:"",protocol:"",search:"",password:"",username:"",port:""};splitOnFirst(str,"#",function(nonHash,hash){if(hash){uri.hash=hash?"#"+hash:""}splitOnFirst(nonHash,"?",function(nonSearch,search){if(search){uri.search="?"+search}if(!nonSearch){return}splitOnFirst(nonSearch,"//",function(protocol,hostUserPortPath){uri.protocol=protocol;splitOnFirst(hostUserPortPath,"/",function(hostUserPort,path){uri.pathname="/"+(path||"");if(uri.protocol||hostUserPort){uri.origin=uri.protocol+"//"+hostUserPort}splitOnFirst(hostUserPort,"@",function(auth,hostPort){if(!hostPort){hostPort=auth}else{var userPass=auth.split(":");uri.username=userPass[0];uri.password=userPass[1]}uri.host=hostPort;splitOnFirst(hostPort,":",function(hostName,port){uri.hostname=hostName;if(port){uri.port=port}})})})})})});uri.href=uri.origin+uri.pathname+uri.search+uri.hash;return uri}function queryParser(uri){var params={};var search=uri.search;if(search){search=search.replace(new RegExp("\\?"),"");var pairs=search.split("&");for(var i in pairs){if(pairs.hasOwnProperty(i)&&pairs[i]){var pair=pairs[i].split("=");params[pair[0]]=decodeURIComponent(pair[1])}}}return params}var liteURL=module.exports.liteURL=function(str){var uri=memo[str];if(typeof uri!=="undefined"){return uri}uri=uriParser(str);uri.params=queryParser(uri);memo[str]=uri;return uri};liteURL.changeQueryParser=function(parser){queryParser=parser}},{}],5:[function(require,module,exports){var queryString={};queryString.parse=function(str){if(typeof str!=="string"){return{}}str=str.trim().replace(/^(\?|#)/,"");if(!str){return{}}return str.trim().split("&").reduce(function(ret,param){var parts=param.replace(/\+/g," ").split("=");var key=parts[0];var val=parts[1];key=decodeURIComponent(key);val=val===undefined?null:decodeURIComponent(val);if(!ret.hasOwnProperty(key)){ret[key]=val}else if(Array.isArray(ret[key])){ret[key].push(val)}else{ret[key]=[ret[key],val]}return ret},{})};queryString.stringify=function(obj){return obj?Object.keys(obj).map(function(key){var val=obj[key];if(Array.isArray(val)){return val.map(function(val2){return encodeURIComponent(key)+"="+encodeURIComponent(val2)}).join("&")}return encodeURIComponent(key)+"="+encodeURIComponent(val)}).join("&"):""};module.exports=queryString},{}]},{},[3]);