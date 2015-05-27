var navBarOpen = false;
var menu;
var menuHeight;
var PREMIUM_USER_COOKIE = "HdcPusr";
var openMode = "1"; //article's mode (open/close article)

$(document).ready(function() {
	setKeyDisplay();
	setLoginIcon();	
	var touchEventName = (typeof(window.ontouchstart) !='undefined') ? 'touchstart' : 'MSPointerDown';
	
	document.querySelector('.main-header .menu-wrapper').addEventListener(touchEventName, toggleMenu);
	document.querySelector('.main-header .login-wrapper').addEventListener(touchEventName, toggleLogin);
	var $menuItems = document.querySelectorAll('nav .menu-item');
	
	for(var el=0; el < $menuItems.length; el++){
		$menuItems[el].addEventListener(touchEventName, redirectToPage);
	}	
	setEllipsisForLongTexts();	
	addTimeStampToUrl(document.location.href);
});

function addTimeStampToUrl(url){
	//justLoggedIn used only for forcing browser to new render the page.used for  login / logut
	if (sessionStorage.justLoggedIn){
	var articles = $("article");
	if (articles && articles.size()>0){
		$.each(articles,function(){
			var anchor =$(".content",this);
			if (anchor && anchor.size()>0 && anchor.attr("href")){
				var href = anchor.attr("href");
				anchor.attr("href",href+"?v="+ new Date().getTime());
			}
		})
	}	
  }
}

function setEllipsisForLongTexts() {
	var jQueryElement = jQuery('section article.teaser .content h2, section article.teaser .content .subtitle, .carousel-article-wrapper .title');
	setEllipsis(jQueryElement);	
}

function setEllipsis(jQueryElement){
	if (jQueryElement.length > 0) {
		jQueryElement.dotdotdot({
			watch: "window",
			after: ".premium-key"
		});
	}
}

function GoToWebSite(){
	var expiredays = 2;
    var value = "yes";
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = "doNotRedirectToMobile=;expires=" + exdate.toUTCString() + ";path=/";
	document.location.href = location.protocol + "//" + location.host;
}

function GoToAppTM(){

	var userAgent = navigator.userAgent.toLowerCase();
	//alert(userAgent);
	var isIphone = userAgent.indexOf("iphone") > -1;
	var isAndroid = userAgent.indexOf("android") > -1;
	//var isIpad = userAgent.indexOf("ipad") > -1;
	var isBlackberry = userAgent.indexOf("blackberry") > -1;
	
	if (isIphone || isAndroid || isBlackberry) 
	{
	    var link;
	    if (isIphone) 
	    {
	    	link = "http://itunes.apple.com/us/app/themarker-dmrqr/id360938308?mt=8";
	    } 
	    else if (isAndroid) 
	    {
	        link = "https://play.google.com/store/apps/details?id=com.casualmobile.themarker";
	    }
	    else if (isBlackberry) 
	    {	    	
	        link = "http://appworld.blackberry.com/webstore/content/50649/";
	    }
	    document.location.href = link;
	}
}

function toggleMenu(){
	var $nav = document.querySelector('nav');
	$nav.className = $nav.className=='open' ? 'close':'open';
}

function GoToWebSiteTM(){
	var expiredays = 2;
    var value = "yes";
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = "doNotRedirectToMobile=;expires=" + exdate.toUTCString() + ";path=/";
	document.location.href = "http://www.themarker.com";
}

function GoToApp(){

	var userAgent = navigator.userAgent.toLowerCase();
	//alert(userAgent);
	var isIphone = userAgent.indexOf("iphone") > -1;
	var isAndroid = userAgent.indexOf("android") > -1;
	//var isIpad = userAgent.indexOf("ipad") > -1;
	var isBlackberry = userAgent.indexOf("blackberry") > -1;
	
	if (isIphone || isAndroid || isBlackberry) 
	{
	    var link;
	    if (isIphone) {
	    	if (isHebrewDomain()) {
	    		link = "http://itunes.apple.com/us/app/h-rz-haaretz-hebrew-edition/id521559643?mt=8";
			}
	    	else
	    	if (isEnglishDomain()) {
	    		link = "https://itunes.apple.com/us/app/haaretz-english-edition-new/id504537897?mt=8";
	    		
	    	}
	    } 
	    else if (isAndroid) 
	    {
	    	if (isHebrewDomain()) {
	    		link = "https://play.google.com/store/apps/details?id=com.haaretz";
			}
	    	else
	    	if (isEnglishDomain()) {
	    		link = "https://play.google.com/store/apps/details?id=com.opentech.haaretz";
	    		
	    	}
	    }
	    else if (isBlackberry) 
	    {	    	
	        link = "http://appworld.blackberry.com/webstore/content/58662/";
	    }
	    document.location.href = link;
	}
}

function getCookie(){
	var cookieName = arguments[0];
	var cookieValue = null;
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = jQuery.trim(cookies[i]);			
			// Does this cookie string begin with the name we want?
			if (cookie.substring(0, cookieName.length + 1) == (cookieName + '=')) {
				cookieValue = unescape(cookie.substring(cookieName.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

function setKeyDisplay(){
	try{
		var premiumCookie   = getCookie(PREMIUM_USER_COOKIE);
	
		if (premiumCookie!= null) {
			$('article.teaser').removeClass('premium');
		} 
	}catch(error){}
}


function redirectToPage(page) {
	if (this.className=='menu-item') {
		page= this.getAttribute('data-url');
		this.className += " active";
	}
	setTimeout(function(){window.location = page;},10);
}

function toggleLogin(){
	var redirectUrl = location.href;
	if (isCookieExist('HdcPusr')) {
		sessionStorage.justLoggedIn=true;
		if (confirm("Are you sure you want to log out from Haaretz.com?")) {
			deleteCookie('HdcPusr');
			deleteCookie('engsso');
			redirectToPage(redirectUrl);
		}
	}
	else {
		redirectToPage('/mobile/login?callbackUrl=' + redirectUrl);
	}
} 

function setLoginIcon() {
	if (isCookieExist('HdcPusr')) {
		$('.main-header .btn-login').css("background-image", "url('/images/mobile/btn-logout.png')");
	}
	else {
		$('.main-header .btn-login').css("background-image", "url('/images/mobile/btn-login.png')");
	}
}

function isCookieExist(cookieName) {
	if (document.cookie.indexOf(cookieName) > -1) {
		return true;
	}
	else return false;
}

function deleteCookie(name) {
	if (isCookieExist(name)) {
		document.cookie = name + "=; expires="+new Date(0).toUTCString() +"; path=/;domain=.haaretz.com;";
	}
}

function lock_onclick() {
	if (getCookie("engsso") != null) {
		if ( confirm("Are you sure You want to logout from haaretz?\n\n You will not be able to see premium content") ) {
			deleteCookie("HdcPusr");
			deleteCookie("engsso");
			window.location.reload();
		}
	}
	else {
		sessionStorage.justLoggedIn=true;
		document.forms[0].submit();
	}
}

function eng_login_form_onclick() {
	var strLayer = 'eng_login';
	layersUrl[strLayer][1] = ssoDomain+"/sso/signIn?cb=parseEngReplyMobile&newsso=true&fromlogin=true&layer=eng_login&";
	popupAction(strLayer);
	var errorText = jQuery('.puShowError').html();
	if (errorText != null && errorText.length > 0) {
		alert(errorText);
	}
	return false;
}

function toMobileHomepage() {
	window.location = window.location.protocol + "//" + window.location.host + '/mobile';
}

function parseEngReplyMobile(){
	inAction = false; // This variable defined in sso (hdcMainServices.js)
	
	if(arguments[0] == 'success') {
		if(arguments[1].length>0) {
			var reply =  eval("(" + arguments[1] + ")") ;

		for(var i in reply){
			 jQuery('#cookies').append("<p><img src='" + reply[i] + "' alt='" + i + "' /></p>");
		}
		if(typeof arguments[2] == "undefined"){
			jQuery("#cookies").find('img').batchImageLoad({
				loadingCompleteCallback: docReload
				//imageLoadedCallback: doNothing
			});
		}
	  }
	  if(typeof arguments[2] != "undefined") {
			jQuery('#sso_form').html('');
			jQuery('#sso_form').append(arguments[2]);
			var msg = '';
			var header = jQuery('#sso_form .puEnvelope.eng_sendpassword .puHeader .puHeadline').html();
			var title = jQuery('#sso_form .puEnvelope.eng_sendpassword .puBody .puTitleHolder .puTitle').html().trim();
			if (header != null) {
				msg += header + '\n\n'; 
			}
			if (title != null) {
				msg += title; 
			}
			if (msg.length > 0) {
				alert(msg);
			}
			
		}

	} else {

		  if(typeof arguments[2] != "undefined") {
			if(arguments[2].match(/fatal/)) {
				jQuery('#sso_form').html('');
				jQuery('#sso_form').append(arguments[2]);
			}  else {
				alert(arguments[2]);
				/*
				jQuery(".puEnvelope .puShowError").html(arguments[2]);
				jQuery(".puEnvelope .puShowError").show();
				*/
			}
		  }
	}
}

function eng_forgotpass_form_onclick() {
	var strLayer = 'eng_forgotpassword';
	var urlIdx = 1;
	layersUrl[strLayer][urlIdx] = ssoDomain+"/user/initPassword?cb=parseEngReplyMobile&newsso=true&layer=eng_sendpassword&site=85&";
	popupAction(strLayer);
	var err = jQuery(".puEnvelope .puShowError").html();
	if (err.length > 0) {
		alert(err);
		$('.login-page .login-form.puEnvelope .submit').removeAttr('disabled');
	}else{
		$('.login-page .login-form.puEnvelope .submit').attr('disabled', 'disabled');		
	}
	return false;
}

function getStyle(el,styleProp) {
  var camelize = function (str) {
    return str.replace(/\-(\w)/g, function(str, letter){
      return letter.toUpperCase();
    });
  };

  if (el.currentStyle) {
    return el.currentStyle[camelize(styleProp)];
  } else if (document.defaultView && document.defaultView.getComputedStyle) {
    return document.defaultView.getComputedStyle(el,null)
                               .getPropertyValue(styleProp);
  } else {
    return el.style[camelize(styleProp)]; 
  }
}

function collectinSurfingData(action, url)
{
	var engSso = getCookie("engsso");
	
	if(engSso!= null)
	 {
		 var HdcRusr = "Rusr=" + getStatCookie('HdcRusr');
		 var HdcPusr = "Pusr=" + getStatCookie('HdcPusr');
		 var sendTo = 'http://ds.haaretz.co.il/ds.php?';
		 var userId = "userId=" + getUserId(engSso);
	     //var url = "url=" + encodeURIComponent(document.URL);
	     var domain = "domain=" + window.location.hostname;
	     var urlS = "url=" + url;
	     data = urlS + "&" + domain + "&" + HdcRusr + "&" + HdcPusr + "&" +  userId + "&actionType=" + action;
	     
	     var script = jQuery('<script><' + '/script>');
	     script.attr('src', sendTo + data);
	     jQuery('head').append( script );
	 }
}