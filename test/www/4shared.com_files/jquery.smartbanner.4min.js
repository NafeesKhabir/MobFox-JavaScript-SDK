/*
 * jQuery Smart Banner
 * Copyright (c) 2012 Arnold Daniels <arnold@jasny.net>
 * Based on 'jQuery Smart Web App Banner' by Kurt Zenisek @ kzeni.com
 */
!function(B){var A=function(D){this.options=B.extend({},B.smartbanner.defaults,D);var C=navigator.standalone;if(this.options.force){this.type=this.options.force}else{if(navigator.userAgent.match(/iPad|iPhone/i)!=null){if(navigator.userAgent.match(/Safari/i)!=null&&window.Number(navigator.userAgent.substr(navigator.userAgent.indexOf("OS ")+3,3).replace("_","."))<6){this.type="ios"}}else{if(navigator.userAgent.match(/Android/i)!=null){this.type="android"}else{if(navigator.userAgent.match(/Windows NT 6.2/i)!=null&&UA.match(/Touch/i)!==null){this.type="windows"}}}}if(!this.type||C||this.getCookie("sb-closed")||this.getCookie("sb-installed")){return }this.scale=this.options.scale=="auto"?B(window).width()/window.screen.width:this.options.scale;if(this.scale<1){this.scale=1}this.title=this.options.title;this.author=this.options.author;this.create();this.show();this.listen()};A.prototype={constructor:A,create:function(){var D,C=this.options.installUrl,F=this.options.price?this.options.price+" - "+(this.type=="android"?this.options.inGooglePlay:this.type=="ios"?this.options.inAppStore:this.options.inWindowsStore):"",E=this.options.iconGloss===null?(this.type=="ios"):this.options.iconGloss;B("body").prepend('<div id="smartbanner" class="'+this.type+'"><div class="sb-container"><a href="#" class="sb-close">&times;</a><span class="sb-icon"></span><div class="sb-info"><strong>'+this.title+"</strong><span>"+this.author+"</span><span>"+F+'</span></div><a href="'+C+'" class="sb-button"><span>'+this.options.button+"</span></a></div></div>");if(this.options.icon){D=this.options.icon}else{if(B('link[rel="apple-touch-icon-precomposed"]').length>0){D=B('link[rel="apple-touch-icon-precomposed"]').attr("href");if(this.options.iconGloss===null){E=false}}else{if(B('link[rel="apple-touch-icon"]').length>0){D=B('link[rel="apple-touch-icon"]').attr("href")}}}if(D){B("#smartbanner .sb-icon").css("background-image","url("+D+")");if(E){B("#smartbanner .sb-icon").addClass("gloss")}}else{B("#smartbanner").addClass("no-icon")}this.bannerHeight=B("#smartbanner").outerHeight()+2;if(this.scale>1){B("#smartbanner").css("height",B("#smartbanner").css("height")*this.scale);B("#smartbanner .sb-container").css("-webkit-transform","scale("+this.scale+")").css("-msie-transform","scale("+this.scale+")").css("-moz-transform","scale("+this.scale+")").css("width",B(window).width()/this.scale)}},listen:function(){B("#smartbanner .sb-close").bind("click",B.proxy(this.close,this));B("#smartbanner .sb-button").bind("click",B.proxy(this.install,this))},show:function(C){B("#smartbanner").stop().show().animate({height:"78px"},this.options.speedIn).addClass("shown")},hide:function(C){B("#smartbanner").stop().animate({height:0},this.options.speedOut,"linear",function(){B(this).hide()}).removeClass("shown")},close:function(C){C.preventDefault();this.hide();this.setCookie("sb-closed","true",this.options.daysHidden)},install:function(C){this.hide();this.setCookie("sb-installed","true",this.options.daysReminder)},setCookie:function(C,E,D){C=this.options.cookiePreName+C;var F=new Date();F.setDate(F.getDate()+D);E=escape(E)+((D==null)?"":"; expires="+F.toUTCString());if(this.options.cookieDomain){E+=";domain="+this.options.cookieDomain}document.cookie=C+"="+E+"; path=/;"},getCookie:function(D){D=this.options.cookiePreName+D;var E,C,G,F=document.cookie.split(";");for(E=0;E<F.length;E++){C=F[E].substr(0,F[E].indexOf("="));G=F[E].substr(F[E].indexOf("=")+1);C=C.replace(/^\s+|\s+$/g,"");if(C==D){return unescape(G)}}return null}};B.smartbanner=function(D){var F=B(window),E=F.data("typeahead"),C=typeof D=="object"&&D;if(!E){F.data("typeahead",(E=new A(C)))}if(typeof D=="string"){E[D]()}};B.smartbanner.defaults={title:null,author:null,price:"Free",inAppStore:"On the App Store",inGooglePlay:"In Google Play",inWindowsStore:"In the Windows Store",icon:null,iconGloss:null,button:"VIEW",scale:"auto",speedIn:300,speedOut:400,daysHidden:15,daysReminder:90,force:null,cookieDomain:null,cookiePreName:""};B.smartbanner.Constructor=A}(window.jQuery);