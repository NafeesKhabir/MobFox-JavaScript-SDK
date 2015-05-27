var HEBREW_DOMAIN = "haaretz.co.il";
var ENGLISH_DOMAIN = "haaretz.com";

function isHebrewDomain() {
	var ret = false;
	if (location.hostname.indexOf(HEBREW_DOMAIN) != -1) {
		ret = true;
	}
	return ret;
}

function isEnglishDomain() {
	var ret = false;
	if (location.hostname.indexOf(ENGLISH_DOMAIN) != -1) {
		ret = true;
	}
	return ret;
}
