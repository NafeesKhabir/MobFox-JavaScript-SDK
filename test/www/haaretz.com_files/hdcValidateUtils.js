

function validateEmptyField(name) {
	if (!name || 0 === name.length) {
		return false;
	}
	return true;
}

function validateNameField(name) {
	if (name.length < 2 || name.length > 40) {
		return false;
	}
	if(!hebEngOnly(name)){
		return false;
	}
	return true;
}

function validateNameFieldHebEngOnly(name) {
	if (name.length < 2 || name.length > 40) {
		return false;
	}
	if(!hebEngOnlyReal(name)){
		return false;
	}
	return true;
}

function validateNumericField(field){
	var numericExpression = /^[0-9]+$/;
	if (field.search(numericExpression)!=-1){
		return true;
	}
	return false;
}


function verifyPassword(password) {	
	if (password.length < 6) {
		return false;
	}
	return true;
}

function verifyPasswordVerfication(password,passwordVerification) {
	if (passwordVerification.length==0 || password != passwordVerification) {
		return false;
	}
	return true;
}


function verifyEmail(email){
//	var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
	var emailRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (email.search(emailRegEx) == -1) {
		return false;
	}
	return true;
}

function verifyEmailLength(email){
	if (email.length > 64) {
		return false;
	}
	return true;
}

function getFieldValueById(id){
	var ans=jQuery("#"+id).val();
	return ans;
}

/*function validateMultipleTextField() {
	for (var i = 0; i < arguments.length; i++)
	{
		//var cre
		var field=arguments[i];
		if (field.val().trim().length < 2 || field.val().trim().length > 40)
		{
//		/	field;
		}
	}
		
		return "SUCCESS";
}*/
//Check if within the defined array there is input with error class
function checkForErrorClass(array,className){
	for (var i = 0; i < array.length; i++){
		if (jQuery("#"+printLinkArray[i]).hasClass(errorClassName)){
			//found error class
			return true;}
	}
	return false;
}
//onblur validation function,check if field is empty if yes add error class to it
function onBlurValidation(obj,errorDivName){
	  if (!validateNameField(obj.value.trim())){
		  obj.className += " "+errorClassName;
	  }
	  else{
		  var re = new RegExp(errorClassName, 'gi');
		  obj.className=obj.className.replace(re,'');
	  }
	  if (checkForErrorClass(printLinkArray,errorClassName))
		  {
		  jQuery("."+errorDivName+"-validation").css("display","block");
		  jQuery("."+errorDivName+"-validation"+ " span").text(generalError);
		  }
	  else{
		  jQuery("."+errorDivName+"-validation").css("display","none");
	  }
}
//
/* Give me a array of input ids and i will set the first "error" filed according to validateNameField function
 * inputsArray        - > ids of all input fields
 * validationFunction - > which validate function to use (emptyFiled ,numericValidate etc)
 * className          - > which class to add /remove
 * isSetFocus         - > set focus of the error field
 */
function checkForFirstEmptyFields(inputsArray,className,validationFunction,isSetFocus){
	for (var i = 0; i < inputsArray.length; i++){
		var input = jQuery("#"+inputsArray[i]);
		var fieldValue= jQuery.trim(input.val());
		var validationFunctionName=window[validationFunction];
		if (!validationFunctionName(fieldValue)){
			input.addClass(className);
			delete inputsArray[i];
			if (isSetFocus){
				input.focus();
			}
			removeErrorClass(inputsArray,className);
			return false;
		}
		else
		{
			if (input.hasClass(className))
			{ 
				input.removeClass(className);
				delete inputsArray[i];
			}
		}
	}
	return true;
}

function removeErrorClass(inputsArray,className,setFocus){
	for (var i = 0; i < inputsArray.length; i++){
		var input = jQuery("#"+inputsArray[i]);
		if (input.hasClass(className))
		{
			input.removeClass(className);
		}
		
	}
}

function haveSpecialChars(data){
	var iChars = "!@#$%^&*()+=[]\\\';,/{}|\:<>?~_";
	   for (var i = 0; i < data.length; i++) {
	  	if (iChars.indexOf(data.charAt(i)) != -1) {
	  		return true;
	  	}
	}
	return false;
}

function hebEngOnly(data){
	if (data == ''){
		return true;
	}
	var hebEngRegEx = /^[a-zA-Z\.\-\"\'\ ]+$/i;
	if (data.search(hebEngRegEx) == -1) {
		return false;
	}
	return true;
}

function hebEngOnlyReal(data){
	if (data == ''){
		return true;
	}
	var hebEngRegEx = /^[a-zA-Zא-ת\.\-\"\'\ ]+$/i;
	if (data.search(hebEngRegEx) == -1) {
		return false;
	}
	return true;
}
