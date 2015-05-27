var applId = "287530407927859";
var fromSite = "85";

var siteString = new String(window.location.toString());
siteString = siteString.replace("#", "");
var layerPrefix = "eng_";
var hdcCookie="engsso";
var siteNum = new Array();
siteNum["www.haaretz.com"] = "85";
siteNum["polodev.haaretz.com"] = "85";

/* services of Haaretz com */ 	
var layersUrl = [];
layersUrl["eng_login"] =			["src", ssoDomain+"/sso/signIn?cb=parseEngReply&newsso=true&fromlogin=true&layer=eng_login&site=85&"];
layersUrl["eng_register"] =			["src", ssoDomain+"/user/register?cb=parseEngRegisterReply&newsso=true&layer=eng_createuser&site=" + fromSite + "&returnTo=" + siteString + "&"];
layersUrl["eng_forgotpassword"]=	["src", ssoDomain+"/user/initPassword?cb=parseEngReply&newsso=true&layer=eng_sendpassword&site=" + fromSite + "&"];
layersUrl["eng_sendforgotpassword"]=	["src", ssoDomain+"/r/resetPassword?cb=parseEngReply&site=" + fromSite + "&"];
layersUrl["eng_changepassword"]=	["src", ssoDomain+"/user/updatePassword?action=update_password&returnTo=null&cb=parseChangePasswordReply&newsso=true&layer=eng_sendpassword&site=" + fromSite + "&" ];
layersUrl["eng_unsubscribe"]=		["src", ssoDomain+"/r/cancellWebUser?cb=parseUnsubscribeReply&" ];
layersUrl["eng_createuser"] =		["innerHTML", "jQuery.unblockUI();"];
layersUrl["eng_error"] =			["innerHTML", "jQuery.unblockUI();"];
layersUrl["eng_sendpassword"] =		["innerHTML", "jQuery.unblockUI();"];
layersUrl["eng_changeusername"] =	["src", ssoDomain+"/sso/changeUsername?cb=parseEngReply&newsso=true&fromlogin=true&layer=eng_changeusername&"];

var ssoRegisterUrlWithFB = 			ssoDomain + "/user/register?fbconnect=true&cb=parseFBAjaxReply&newsso=true&fromlogin=true&site=85&token=";


jQuery(document).ready(function() {
	var ssoCookie    = getCookie("engsso");
	var logOutcookie =  getCookie("logout");
	
	//init FB scripts
	if (!ssoCookie && logOutcookie != "true" && typeof(FB) !== "undefined") {
		FB.init({appId: applId, status: true, cookie: true, xfbml: true});
		FB.getLoginStatus(function(response) {
			if (response.authResponse) {
				 // logged in and connected user, someone you know
				var token = response.authResponse.accessToken;
				createAndLoadScript("src", ssoDomain + "/sso/signIn?cb=parseFBAjaxReply&newsso=true&fromlogin=true&layer=" + layerPrefix + "login&fbconnect=true&token=" + token, "signinscript");
			 }
		});
	}
	var jQueryQuery = '#facebook_cafe,.facebook_connect';
	
	jQuery(jQueryQuery).click(function(){
		fbRegister();
	});
	
	//set login script
	jQuery('#login1,#login2,#login3, .login-cafe,.login').click(function(){
		popUpLogin();
	});
	/* Load the login popup */
	jQuery.ajax({
		url		: staticSsoDomain + "/script/layer.jsp?layer=" + layerPrefix + "login",
		type	: "GET",
		jsonp	: "cb",
		success : function(data, status) {
			jQuery('#sso_login_form').html(data);
		},
		error	: function(data, status) {
			//TODO:do something
		},
		timeout	: 3000,
		dataType: 'jsonp',
		cache   : 'true',
		jsonpCallback : 'processData'
	});
	
	//set registration scripts
	jQueryQuery = '#register,.register';
	jQuery('#register,.register').click(registerLayer);
	
	submitRegister();
});


function fbRegister(){
	FB.init({
		appId  : applId,  
		status : true, // check login status
		cookie : true, // enable cookies to allow the server to access the session
		xfbml  : true  // parse XFBML
	  });
	FB.login(function(response) {
			if (response.authResponse) {
				var token = response.authResponse.accessToken;
				ssoRegisterUrlWithFB += token;
				createAndLoadScript("src", ssoRegisterUrlWithFB, "signinscript");
			} else {
				// user is logged in, but did not grant any permissions
			}
	
		},
		{scope:'email,offline_access,publish_stream,read_stream'}
	);
}


function popUpLogin(){
	if (layerPrefix == "eng_") {
		clearEngForms();
	}
	else {
		jQuery('.error').html('');
		jQuery('.error').hide();
	}
	  jQuery.blockUI.defaults.css.backgroundColor = '';
	  jQuery.blockUI.defaults.css.border = 'none';
	  jQuery.blockUI.defaults.css.textAlign = 'right';
	  jQuery.blockUI.defaults.css.cursor = 'default';
	  jQuery.blockUI.defaults.overlayCSS.cursor = 'default';
	  jQuery.blockUI.defaults.overlayCSS.backgroundColor = '' ;
	  jQuery.blockUI.defaults.overlayCSS.backgroundImage = 'url("'+ staticSsoDomain + '/images/puBG.png")' ;
	  jQuery.blockUI({ message: $('#sso_login_form') }); 
	 
	  submitForms();
}
 

/**Prepare the call for the register popup
 * 
 * @returns
 */
function registerLayer(){
	createAndLoadScript("src", staticSsoDomain + "/script/layer.jsp?cb=parseReply&layer=" + layerPrefix + "register", "registerscript");
}


/**Prepare the call for the forgotPassword popup
 * 
 * @returns
 */
function forgotPasswordLayer() {
	if(typeof isSendForgotPassword == "undefined" || !isSendForgotPassword)
	{
		createAndLoadScript("src" ,staticSsoDomain + "/script/layer.jsp?cb=parseReply&layer=" + layerPrefix + "forgotpassword", "forgotscript");
	}
	else
	{
		createAndLoadScript("src" ,staticSsoDomain + "/script/layer.jsp?cb=parseReply&layer=" + layerPrefix + "sendforgotpassword", "forgotscript");
	}
	
}


/**parse the the popup
 * 
 * @returns
 */
function parseReply(){
	jQuery.blockUI.defaults.css.backgroundColor = '';
    jQuery.blockUI.defaults.css.left = '31%' ;
    jQuery.blockUI.defaults.css.top = '80px' ;
	jQuery.blockUI.defaults.css.border = 'none';
	jQuery.blockUI.defaults.css.textAlign = 'right';
	jQuery.blockUI.defaults.css.cursor = 'default';
	jQuery.blockUI.defaults.css.width = 'auto';
	jQuery.blockUI.defaults.overlayCSS.cursor = 'default';
	jQuery.blockUI.defaults.overlayCSS.backgroundColor = '' ;
	jQuery.blockUI.defaults.overlayCSS.backgroundImage = 'url("'+staticSsoDomain + '/images/puBG.png")' ;
    jQuery.blockUI.defaults.css.position = 'fixed';
	jQuery('#sso_form').html('');
	jQuery('#sso_form').append(arguments[0]);
	jQuery.blockUI({ message: $('#sso_form') });
}


/**validate field before submit.
 * @param fieldId - The field id to validate
 * @param formId - optional form id to validate. Default value is 'sso_form'
 * @returns {Boolean}
 */
function validateField(fieldId, formId){
	if(formId == 'sso_login_form'){
		formId =  '#sso_login_form';
	}
	else {
		formId =  '#sso_form';
	}
	if ( jQuery.trim( jQuery(formId +' input[name=' + fieldId + ']').val() ).length == 0 ){
		jQuery(formId +' .error').html(jQuery(formId +' #' + fieldId + '_error').html()) ;
		jQuery(formId +' #' + fieldId).removeClass("inputBorderSignUp") ;
		jQuery(formId +' #' + fieldId).addClass("inputTextError") ;
		jQuery(formId+ ' .error').show();
		return false;
	}
	return true;
}


/**reply method callback by facebook
 * 
 * @returns
 */
function parseFBAjaxReply(){
	jQuery('#ajaxLoader').hide() ; 
	if(arguments[0] == 'success') {
		if(arguments[1].length>0) {
			var reply =  eval("(" + arguments[1] + ")") ;
			for(var i in reply){
				 jQuery('#cookies').append("<p><img src='" + reply[i] + "' alt='" + i + "' /></p>");
			}
			if(typeof arguments[2] == "undefined"){
				jQuery("#cookies").find('img').batchImageLoad({
					loadingCompleteCallback: docReload
					});
			}
		}
		if(typeof arguments[2] != "undefined") {
			jQuery('#sso_form').html('');
			jQuery('#sso_form').append(arguments[2]);
		}
	} else {
		if(typeof arguments[2] != "undefined") {
			if(arguments[2].match(/fatal/)) {
				jQuery('#sso_form').html('');
				jQuery('#sso_form').append(arguments[2]);
			}  else {
				jQuery('.ssoForms .error').html('');
				jQuery('.ssoForms .error').append(arguments[2]);
				jQuery('.ssoForms .error').show();
			}
		}
	}
}


/**Reloads the window to reflect the login status.
 * 
 * @returns
 */ 
function docReload(){
	if (getCookie("engsso") != null){
		window.location.reload();
	}
}


/**
 * 
 * @param cookieName - String representation of a cookie name
 * @returns the cookie value of a given cookie name
 */
function getCookie(cookieName) {
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


/**
 * Creates a new javascript element
 * @param scr_method - the attribute/method to set for the newly created element
 * @param src_url - the valuew for the new attribute
 * @param script_id - an HTML id
 * @returns
 */
function createAndLoadScript(scr_method, src_url, script_id) {
	var oScript = document.createElement("SCRIPT");
	var scriptId = document.getElementById(script_id);
	if(scriptId){
		jQuery("#" +script_id).remove();
	}
	var randomnumber=Math.floor(Math.random()*1001);
	oScript.id = script_id;
	oScript[scr_method] = src_url+"&rnd="+randomnumber;
	//jQuery("head").append(oScript);
	document.getElementsByTagName("head")[0].appendChild(oScript);
}

function submitForms()
{
	submitLoginForm();
	submitForgotPasswordForm();
	
	
}

function submitLoginForm(){
	var ssoLoginForm = $("#sso_login_form");
	
	ssoLoginForm.unbind('keypress', loginOnKeypressHandler); 
	ssoLoginForm.bind('keypress', loginOnKeypressHandler);
	
}

function loginOnKeypressHandler(event){
	var keycode = event.keyCode;
	if (keycode == '13') {
		$(".puEnvelope.eng_login .puButton").click();
	}
}

function submitForgotPasswordForm()
{
	var ssoForgotPasswordForm = $("#sso_form");
	
	ssoForgotPasswordForm.unbind('keypress', forgotPasswordOnKeypressHandler); 
	ssoForgotPasswordForm.bind('keypress', forgotPasswordOnKeypressHandler);
}

function forgotPasswordOnKeypressHandler(event){
	var keycode = event.keyCode;
	if (keycode == '13') {
		$(".puEnvelope.eng_forgotpassword .puButton").click();
	}
}

function submitRegister(){
	var ssoRegisterForm = $("#sso_form");
	
	ssoRegisterForm.unbind('keypress', registerOnKeypressHandler); 
	ssoRegisterForm.bind('keypress', registerOnKeypressHandler);
}

function registerOnKeypressHandler(event){
	var keycode = event.keyCode;
	if (keycode == '13') {
		$(".puEnvelope.eng_register .puButton").click();
	}
}

/**Handles the response of a SSO popup
 * 
 * @param strLayer - The service of the sso
 * @param srcObj - The object who initiated the call or event 
 * @returns
 */

var inAction = false;

function popupAction(strLayer, srcObj) {
	if (srcObj != undefined) {
		$(srcObj).siblings('.please-wait').show();
	}
	if (inAction) {
		return false;
	}
	inAction = true;
	clearEngError();
	var oCurrentForm = jQuery("#" + strLayer + "_form");
//	var sURL = layersUrl[strLayer][1].replace("%ssoDomain%", ssoDomain);
	
	if(strLayer == 'eng_login' && validateLoginForm(oCurrentForm)){
		setUsernamePasswordCookie(oCurrentForm); 
		createAndLoadScript(layersUrl[strLayer][0], layersUrl[strLayer][1] + (layersUrl[strLayer][0] == "src" ? oCurrentForm.serialize() : ""), "script_" + strLayer);
	}	
	if(strLayer != 'eng_login' && validateEngForms(oCurrentForm)) {
		setUsernamePasswordCookie(oCurrentForm); 
		createAndLoadScript(layersUrl[strLayer][0], layersUrl[strLayer][1] + (layersUrl[strLayer][0] == "src" ? oCurrentForm.serialize() : ""), "script_" + strLayer);
	}
	else {
		$(srcObj).siblings('.please-wait').hide();
		inAction =false;
	}
	
}


function popupActionTemp(strLayer, srcObj){
   	$(srcObj).siblings('.please-wait').show();
	clearEngError();

	var oCurrentForm = jQuery("#" + strLayer + "_form");
	//var sURL = layersUrl[strLayer][1].replace("%ssoDomain%", ssoDomain);
	var isValid =  oCurrentForm.valid();
	if (isValid) {
		setUsernamePasswordCookie(oCurrentForm);
		createAndLoadScript(layersUrl[strLayer][0], layersUrl[strLayer][1] + (layersUrl[strLayer][0] == "src" ? oCurrentForm.serialize() : ""), "script_" + strLayer);
	}
	else {
		$(srcObj).siblings('.please-wait').hide();
	}
}

/**Set username and password in a cookie to avoid the 'LastPass' plugin problem
 * that copies the password into the address bar. 
 * 
 * @returns
 */
function setUsernamePasswordCookie(oCurrentForm) {
	var login = encodeURIComponent(jQuery('#userName', oCurrentForm).val());
	var password =  encodeURIComponent(jQuery('#password', oCurrentForm).val());
	document.cookie = 'login=' + login + ';path=/;domain=.haaretz.com';		
	document.cookie = 'password=' + password + ';path=/;domain=.haaretz.com';
}


/**Validates form input for popup action - before calling the service
 * 
 * @param oCurrentForm
 * @returns
 */
function validateEngForms(oCurrentForm) {
	var bReturn = true;
	var sMsg    = "";
	
	jQuery("input, select", oCurrentForm).each(function() {
		this.value = jQuery.trim(this.value);
		if (jQuery(this).attr("name") == "firstName") {
			if(!validateNameField(this.value)){
				if(hebEngOnly(this.value)){
					bReturn = false;
					jQuery(this).addClass("puTextError");
					sMsg = firstNameError;
					return false;
				}else{
					bReturn = false;
					jQuery(this).addClass("puTextError");
					sMsg = firstNameEngError;
					return false;
				}
				
			}
			if(haveSpecialChars(this.value)){
				bReturn = false;
				jQuery(this).addClass("puTextError");
				sMsg = specialCharsError;
				return false;
			}
		}
		else if (jQuery(this).attr("name") == "lastName") {
			if(!validateNameField(this.value)){	
				if(hebEngOnly(this.value)){
					bReturn = false;
					jQuery(this).addClass("puTextError");
					sMsg = lastNameError;
					return false;
				}else{
					bReturn = false;
					jQuery(this).addClass("puTextError");
					sMsg = lastNameEngError;
					return false;
				}	
			}
			
			if(haveSpecialChars(this.value)){
				bReturn = false;
				jQuery(this).addClass("puTextError");
				sMsg = specialCharsError;
				return false;
			}
		}
		else if (jQuery(this).attr("name") == "userName") {
			if (!verifyEmail(this.value)) {
				bReturn = false;
				jQuery(this).addClass("puTextError");
				sMsg = emailValidityError;
				return false;
			}
			if (!verifyEmailLength(this.value)) {
				bReturn = false;
				jQuery(this).addClass("puTextError");
				sMsg = emailLengthError;
				return false;
			}
		}
		else if (jQuery(this).attr("name") == "password" && !verifyPassword(this.value)) {
			bReturn = false;
			jQuery(this).addClass("puTextError");
			sMsg = passwordError;
			return false;
		}
		else if (this.id == "verification") {
			if (!verifyPasswordVerfication(jQuery("#password", oCurrentForm).val(),this.value)) {	
				bReturn = false;
				jQuery(this).addClass("puTextError");
				sMsg = passwordVerificationError;
				return false;
			}
		}
		else if (this.id == "country" && this.value == '') {
			bReturn = false;
			jQuery(this).addClass("puTextError");
			sMsg = countryError;
		}
	});
	if (!bReturn) {
		jQuery(".puEnvelope .puShowError").html(sMsg);
		jQuery(".puEnvelope .puShowError").show();
	}
	return bReturn;
}


function validateLoginForm(oCurrentForm){
	bReturn = true;
	jQuery(".puEnvelope .puShowError").hide();
	jQuery(".puEnvelope .puShowError").html("");
	jQuery("input, select", oCurrentForm).each(function() {
		this.value = jQuery.trim(this.value);
		if (jQuery(this).attr("name") == "userName") {
			if (!verifyEmail(this.value)) {
				bReturn = false;
				jQuery(this).addClass("puTextError");
				sMsg = emailValidityError;
				return false;
			}
			if (!verifyEmailLength(this.value)) {
				bReturn = false;
				jQuery(this).addClass("puTextError");
				sMsg = emailLengthError;
				return false;
			}
		}
		if (jQuery(this).attr("name") == "password" && ! jQuery(this).val()){			
			bReturn = false;
			jQuery(this).addClass("puTextError");
			sMsg = 'Please enter your password.';
			return false;			
		} 
		});
	if (!bReturn) {
		jQuery(".puEnvelope .puShowError").html(sMsg);
		jQuery(".puEnvelope .puShowError").show();
	}
	return bReturn;
}






/**parse ajax reply for different ssoHaaretzcom services
 * 
 * @returns
 */
function parseEngReply(){
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
		}

	} else {
		if(arguments[0] == 'ok')
		 {
			jQuery.unblockUI();
			showPopWin('/js/popup_iframes/forgot_password_success.html',417,248);
			//alert("ok");
			//$(".puBody").slideUp("fast");
			//$(".puBody-sso-respond").slideDown("slow");
			//$(".respond-from-sso").text('הוראות לעדכון סיסמה נשלחו לתיבת הדוא"ל שלך');
			//createAndLoadScript("src" ,staticSsoDomain + "/script/layer.jsp?layer=eng_sendpassword", "sendpasswordscript");
		
		 }
		 else
	     {
			 if(typeof arguments[2] != "undefined") {
				if(arguments[2].match(/fatal/)) {
					jQuery('#sso_form').html('');
					jQuery('#sso_form').append(arguments[2]);
				}  else {
					jQuery(".puEnvelope .puShowError").html(arguments[2]);
					jQuery(".puEnvelope .puShowError").show();
					
				}
			  }
		 }
	}
	inAction = false;
}


/**parse ajax reply for ssoHaaretzcom register service
 * Note: this is a callback function that returned from the response string. Its parameters are not part of the JQuery API
 *
 * @returns
 */
function parseEngRegisterReply(ajaxStatusResult, jscriptToExec, responseString){
	if(ajaxStatusResult == 'success') {
		if(jscriptToExec.length>0) {
			var reply =  eval("(" + jscriptToExec + ")") ;
			
			for(var i in reply){
				jQuery('#cookies').append("<p><img src='" + reply[i] + "' alt='" + i + "' /></p>");
			}
			if(typeof responseString == "undefined"){
				jQuery("#cookies").find('img').batchImageLoad({
					loadingCompleteCallback: docReload
					//imageLoadedCallback: doNothing
				});
			}
		}
		if(typeof responseString != "undefined") {
			jQuery('#sso_form').html('');
			jQuery('#sso_form').append(responseString);
		}
		
	} else {
		$('.eng_register .please-wait').hide();
		if(typeof responseString != "undefined") {
			if(responseString.match(/fatal/)) {
				jQuery('#sso_form').html('');
				jQuery('#sso_form').append(responseString);
			}  else {
				jQuery(".puEnvelope .puShowError").html(responseString);
				jQuery(".puEnvelope .puShowError").show();
			}
		}
	}
}


/**Clear the sso form error messages
 * 
 * @returns
 */
function clearEngForms() {
	var puInputs = jQuery(".puEnvelope input");
	
	clearEngError();
	puInputs.each(function() {
		jQuery(this).val("");
	});
}


/**Clear the sso form error messages
 * 
 * @returns
 */
function clearEngError() {
	var puErrors = jQuery(".puEnvelope .puShowError");
	var puInputs = jQuery(".puEnvelope input");

    puInputs.removeClass("error");
	puInputs.removeClass("puTextError");
	puErrors.hide();
	puErrors.html("");
	$('.puLnkAndBtn').show();
}

/**reads sso data from cookie*/
function getValueFromCookie(field){
	ssoData = new Array();
	var cookie = getCookie("engsso");
	if (cookie){
		var lines = cookie.split(":");
		for (var i = 0; i < lines.length; i++){
			var parts = lines[i].split("=");
			if (parts.length == 2 ){
				ssoData[parts[0]] = parts[1];
			}
		}
	}
	var key = field;
	var param = null;
	if (ssoData){
		param = ssoData[key];
	}
	return param;
}


function submitEmbeddedLoginForm()
{
	$("#lUserName").removeClass("redBorder");
	$("#lPassword").removeClass("redBorder");
	
	var userName = $("#lUserName").val();
	var password = $("#lPassword").val();
	
	if(!verifyEmail(userName)){
		jQuery("#loginError").html(emailValidityError);
		$("#lUserName").addClass("redBorder");
		return false;
	}
	
	var loginUrl = ssoDomain+"/sso/signIn?cb=loginCallback&newsso=true&fromlogin=true&layer=eng_login&";
	//loginUrl = loginUrl.replace("%ssoDomain%", ssoDomain);
	loginUrl += "userName=" + userName + "&password=" + password;
	createAndLoadScript("src",loginUrl,"script_eng_login");
	return true;
}


function loginFormCaptureKey(evt,thisObj) {
    evt = (evt) ? evt : ((window.event) ? window.event : "")
    if (evt) {
        // process event here
        if ( evt.keyCode==13 || evt.which==13 ) {
            thisObj.blur();
            submitEmbeddedLoginForm();
        }
    }
}


function loginCallback()
{
	jQuery("#loginError").html("");
	if(arguments[0] == 'success') {
		if(arguments[1].length>0) {
			var reply =  eval("(" + arguments[1] + ")") ;

		for(var i in reply){
			 jQuery('#cookies').append("<p><img src='" + reply[i] + "' alt='" + i + "' /></p>");
		}
		/*if (logPruchaseClick) {
			logPruchaseClick();
		}*/
		if(typeof arguments[2] == "undefined"){
			jQuery("#cookies").find('img').batchImageLoad({
				loadingCompleteCallback: redirect
				//loadingCompleteCallback: docReload
				//imageLoadedCallback: doNothing
			});
		}
	  }
	  if(typeof arguments[2] != "undefined") {
			jQuery('#sso_form').html('');
			jQuery('#sso_form').append(arguments[2]);
		}

	} else {

		  if(typeof arguments[2] != "undefined") {
			if(arguments[2].match(/fatal/)) {
				jQuery('#sso_form').html('');
				jQuery('#sso_form').append(arguments[2]);
			}  else {
				jQuery("#loginError").html(loginError);
				
			}
		  }
	}
}