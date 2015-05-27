try{
	var dfpTempLocationString = ""+location;
	var dfpDomain = "haaretz.com";
	var dcDebugReport = "";
       var adUnitBase = '/9401/haaretz.com.web';
       var adUnitPlazma = 'haaretz.com.web.plazma';
       var adUnitUnderPlazma = 'haaretz.com.web.leaderboard.top';
	var adUnitMaavaron = "haaretz.com.web.maavaron";
	var adUnitTalkback = "haaretz.com.web.box.below_talkback";
	var adUnitfullbannerTalkback = "haaretz.com.web.fullbanner.talkback";
	var isPremiumArticle = false;
	var dcTmCookieDataString = "";


	//Staging
	var dfpStg = "";
	if(dfpTempLocationString.indexOf('haaretz.com:8080') != -1 )
	{
		//dev
		dfpStg="1";
	}
	else if(dfpTempLocationString.indexOf('pre.haaretz.com') != -1)
	{
		//test
		dfpStg="2";
	}else if(dfpTempLocationString.indexOf('cmlink/Haaretz.HomePage') != -1)
	{
		dfpStg="3";
	}

	function isPremiumArticleFunc(){
		if (typeof dfp_articleId!= "undefined"){
			var articleUrl  = window.location.href;
			if (articleUrl.indexOf('premium') != -1){
				return true;
			}  
		} 
		return false;
	}

	isPremiumArticle = isPremiumArticleFunc();

	//ArticleId
	var dfpArticleId = "0";
	if (typeof dfp_articleId!= "undefined"){
		dfpArticleId = dfp_articleId;
	}



	function getUserType()
	{
		// possible return values are: "anonymous","registered","digitalOnly","digitalAndPrint"
		if(typeof dfpLoginUser === 'undefined' || dfpLoginUser == null) // not logged in at all => anonymous
		{
			return "anonymous";
		}
		else if(typeof dfpPayerUser === 'undefined' || dfpPayerUser == null) // logged in but not paying => registered
		{
			return "registered";
		}
		else // paying
		{
			return "payer";
		}
	}

	function getAdType(dcTempAdType) {
		if ((typeof dcTempAdType === 'undefined') || (dcTempAdType == null) || (typeof dcTempAdType != 'undefined' && dcTempAdType == "")) {
			return "all";
		}
		else {
			return dcTempAdType;
		}
	}
	
	function parseCookie(cookieValue,key)
	{
		// pattern: cookieValue = "key1=value1:key2=value2:key3=value3....."
		var retVal = "";
		var lines = cookieValue.split(":");
		for ( var i = 0; i < lines.length; i++) 
		{
			var parts = lines[i].split("=");
			if (parts.length == 2) 
			{
				if(key == parts[0])
				{
					retVal = parts[1];
				}
			}             
		}
		return retVal;
	}	
	

	function isMavaaronInArticlePage(adUnitName){
		if (dfpArticleId != "0" && (adUnitName == adUnitMaavaron)){
			return true;
		} 
		return false;
	}

	var dfpUserType = getUserType();

	// return true/false - if to send or not send request to dfp. 
	function sendRequestToDFP(dcTempAdType, adUnitName){

		//update the counter of this adUnit Impression
		adUnit(adUnitName).updateNumOfImpressions();

		//limiting calls to premium product by using cookies
		if (adUnit(adUnitName).hasMoreImpressions() == false){
			return false;
		}

		//talkback request will send only after the user click on talkback and not onload	
		if (adUnitName == adUnitfullbannerTalkback){
			return false;
		}
		
		//show haaretz.com.web.box.below_talkback only on premium article
		if ((!isPremiumArticle && (adUnitName == adUnitTalkback)) || ((dfpUserType == "payer") &&(adUnitName == adUnitTalkback))){
			return false; 
		}

		//should not call to Maavaron in an article page
		if (isMavaaronInArticlePage(adUnitName)){
			return false;
		}

		if (!!document.referrer.match('loc.haaretz')){
		  return false;
		}

		// Debug check
		if ((typeof dfpLoginUser === 'undefined') || (typeof dfpPayerUser === 'undefined')){
			dcDebugReport[dcDebugReport.length] = "Warning, dfpLoginUser / dfpPayerUser are undefined!";
			return true;
		}

		var adType = getAdType(dcTempAdType);
		var userType = getUserType();

	
		// total of 7 adTypes: "all","nonPaying","anonymous","registered","paying","digitalOnly","digitalAndPrint"
		if(adType == "all") // one case - "all"
		{
			return true;	
		}
		else if(adType == userType) // 4 cases "anonymous","registered","digitalOnly","digitalAndPrint"
		{
			return true;
		}
		else if(adType == "nonPaying" && (userType == "anonymous" || userType == "registered")) // 1 case - "nonPaying"
		{
			return true;
		}
		else if(adType == "paying" && userType == "payer") // 1 case - "paying"
		{
			return true;
		}
		return false;
	}

	

}catch(err){
	var errorMsg = err.message;
}	