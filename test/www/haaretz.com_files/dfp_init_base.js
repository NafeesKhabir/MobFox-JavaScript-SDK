// version 0.7
try {

   if (!window.gptLoaded || window.gptLoaded == false) {
        //load googletagservices JS
        var gptadslots = [];
        var googletag = googletag || {};
        googletag.cmd = googletag.cmd || [];
        (function() {
            var gads = document.createElement('script');
            gads.async = true;
            gads.type = 'text/javascript';
            var useSSL = 'https:' == document.location.protocol;
            gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
            var node = document.getElementsByTagName('script')[0];
            node.parentNode.insertBefore(gads, node);
        })();
    }

    var REGEX_FREQUENCY_PATTERN = /(\d+)[/](\d)*(\w+)/; //EXAMPLE  '1/2day'   		from polopoly settings
    var REGEX_MAP_ARRAY_FREQUENCY_PATTERN = /(\d+)[/](\d+)/; //EXAMPLE  '1/1403297999000'	from cookie "impression" value
    var siteDomain = window.location.hostname.replace(/([a-zA-Z0-9]+.)/, "");
    var impressionsMap = new Array();
    var adUnitCacheArray = new Array();
    var isHomePage = (typeof isHomePage != 'undefined')?isHomePage : true;
    var isDocumentLoaded = false;
    var adUnitMaavaronPath = "";
    var adUnitMaavaronSize = [];
    var isAlreadyUpadted = false;

    // return cookie value
    function getCookieValue() {
        var cookieName = arguments[0];
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = (cookies[i]).replace(/^\s+|\s+$/g, "");
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, cookieName.length + 1) == (cookieName + '=')) {
                    cookieValue = unescape(cookie.substring(cookieName.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function setCookieValue(name, value, path, domain, secure) {
        var cookie_string = name + "=" + escape(value);
        var expires = new Date();
        expires.setTime(expires.getTime() + 10000000000);
        cookie_string += "; expires=" + expires.toGMTString();

        if (path) {
            cookie_string += "; path=" + escape(path);
        }
        if (domain) {
            cookie_string += "; domain=" + escape(domain);
        }
        if (secure) {
            cookie_string += "; secure";
        }
        document.cookie = cookie_string;
    }

    //user gender && user age
    var dfpUrGdr = "none";
    var dfpUrAe = "none";
    var dfpLoginUser = "";
    var dfpPayerUser = "";
    var dcTmCookieDataString = "";

    var dcCookieCounterStart;
    var dcCookieCounterEnd;
    var dcCookieName = ""

    if (siteDomain == "haaretz.com") {
        dfpLoginUser = getCookieValue("engsso");
        dfpPayerUser = getCookieValue("HdcPusr");
        dcCookieName = "engsso";
    } else {
        dfpLoginUser = getCookieValue("tmsso");
        dfpPayerUser = getCookieValue("HtzPusr");
        dcCookieName = "tmsso";
    }


    if (document.cookie.length > 0) {
        if (document.cookie.indexOf(dcCookieName) != -1) {
            dcCookieCounterStart = document.cookie.indexOf(dcCookieName + "=");
            if (dcCookieCounterStart != -1) {
                dcCookieCounterStart = dcCookieCounterStart + dcCookieName.length + 1;
                dcCookieCounterEnd = document.cookie.indexOf(";", dcCookieCounterStart);
                if (dcCookieCounterEnd == -1) {
                    dcCookieCounterEnd = document.cookie.length;
                }
                dcTmCookieDataString = unescape(document.cookie.substring(dcCookieCounterStart, dcCookieCounterEnd));
            }
        }
    }

    var dcCookieDataArray = dcTmCookieDataString.split(":");
    for (i = 0; i < dcCookieDataArray.length; i++) {
        if (dcCookieDataArray[i].indexOf("urgdr=") != -1) {
            dfpUrGdr = dcCookieDataArray[i].substring(dcCookieDataArray[i].indexOf("=") + 1, dcCookieDataArray[i].length)
        }
        if (dcCookieDataArray[i].indexOf("usrae=") != -1) {
            dfpUrAe = dcCookieDataArray[i].substring(dcCookieDataArray[i].indexOf("=") + 1, dcCookieDataArray[i].length)
        }
    }




    var impressions = localStorage.getItem("impressions"); 
    if (impressions != null) {
        impressions = impressions.split(';');
        impressions.forEach(function(entry) {
            var adUnitImpression = entry.split(' = ');
            impressionsMap[adUnitImpression[0]] = adUnitImpression[1];
        });
    }



    function isAdUnitExistInCache(adUnitName) {
        return (adUnitCacheArray[adUnitName] != null) ? true : false;
    }

    function adUnit(adUnitName) {
        //if adUnit already exist, return the adUnit and dont create new one. 
        if (isAdUnitExistInCache(adUnitName)) {
            return adUnitCacheArray[adUnitName];
        }

        var adUnitObject = new adUnitDFP(adUnitName);
        adUnitObject.name = adUnitName;
        adUnitCacheArray[adUnitName] = adUnitObject;

        return adUnitObject;
    }

    function adUnitDFP(adUnitName) {
        this.adUnitName = adUnitName;
        if (typeof adUnitsFrequencyMap[this.adUnitName + '.all'] != 'undefined') {
            this.adUnitNameByDepartment = this.adUnitName + '.all';
        } else {
            this.adUnitNameByDepartment = (isHomePage) ? (this.adUnitName + '.hp') : (this.adUnitName + '.section');
        }
        this.max_Impressions = -1;
        this.expiresDate = -1;

        var adUnitFrequency = adUnitsFrequencyMap[this.adUnitNameByDepartment];

        if (typeof adUnitFrequency != "undefined") {
            this.max_Impressions = adUnitFrequency.replace(REGEX_FREQUENCY_PATTERN, "$1");
            this.periodNumber = adUnitFrequency.replace(REGEX_FREQUENCY_PATTERN, "$2")
            this.period = adUnitFrequency.replace(REGEX_FREQUENCY_PATTERN, "$3");
        }

        if (this.max_Impressions != -1) {
            if (typeof impressionsMap[this.adUnitNameByDepartment] != "undefined") {
                var adUnitFrequency = impressionsMap[this.adUnitNameByDepartment];
                this.expiresDate = adUnitFrequency.replace(REGEX_MAP_ARRAY_FREQUENCY_PATTERN, "$2");
            }
        }

        var d = new Date();
        var hh = d.getHours();
        var dd = d.getDate();
        var mm = d.getMonth();
        var yy = d.getFullYear();
        if (this.period == "day") {
            hh = 23;
        }

        if (this.periodNumber != "" && (typeof this.periodNumber != "undefined")) {
            if (this.period == "day") {
                dd += parseInt(this.periodNumber) - 1;
            } else {
                hh += parseInt(this.periodNumber) - 1;
            }
        }

        var date = new Date(yy, mm, dd, hh, 59, 59);
        this.expiresDate = (this.expiresDate != -1) ? this.expiresDate : Number(date).toString();
    }

    adUnitDFP.prototype.nextExpiresDate = function() {
        var d = new Date();
        var hh = d.getHours();
        var dd = d.getDate();
        var mm = d.getMonth();
        var yy = d.getFullYear();
        if (this.period == "day") {
            hh = 23;
        }

        if (this.periodNumber != "" && (typeof this.periodNumber != "undefined")) {
            if (this.period == "day") {
                dd += parseInt(this.periodNumber) - 1;
            } else {
                hh += parseInt(this.periodNumber) - 1;
            }
        }

        var date = new Date(yy, mm, dd, hh, 59, 59);

        return Number(date).toString();
    };


    adUnitDFP.prototype.maxImpressions = function() {
        var adUnitFrequency = adUnitsFrequencyMap[this.adUnitNameByDepartment];
        if (typeof adUnitFrequency != "undefined") {
            var adUnitImpression = adUnitFrequency.replace(REGEX_FREQUENCY_PATTERN, "$1");
            return adUnitImpression;
        }

        return -1;
    };

    adUnitDFP.prototype.maxImpressionsPeriod = function() {
        var adUnitFrequency = adUnitsFrequencyMap[this.adUnitNameByDepartment];
        if (typeof adUnitFrequency != "undefined") {
            var adUnitMaxImpressionsPeriod = adUnitFrequency.replace(REGEX_FREQUENCY_PATTERN, "$3");
            return adUnitMaxImpressionsPeriod;
        }
        return -1;
    };

    adUnitDFP.prototype.getNumOfImpressions = function() {

        //get impressions only if define on Frequency Map
        if (adUnit(this.adUnitName).max_Impressions != -1) {
            if (typeof impressionsMap[this.adUnitNameByDepartment] != "undefined") {
                var adUnitFrequency = impressionsMap[this.adUnitNameByDepartment];
                var adUnitImpression = adUnitFrequency.replace(REGEX_MAP_ARRAY_FREQUENCY_PATTERN, "$1");

                return adUnitImpression;
            } else {
                var adUnitImpression = "0";

                return adUnitImpression;
            }
        } else {
            return "-1";
        }
    }

    adUnitDFP.prototype.getPeriodImpression = function() {
        if (typeof adUnitFrequency != "undefined") {
            var adUnitFrequency = impressionsMap[this.adUnitNameByDepartment];
            var adUnitPeriod = adUnitFrequency.replace(REGEX_MAP_ARRAY_FREQUENCY_PATTERN, "$2");

            return adUnitPeriod;
        }
        return -1;
    }

    adUnitDFP.prototype.updateNumOfImpressions = function() {
        //update only if define on Frequency Map
        var now = new Date();
        var expiresNumber = Number(this.expiresDate);
        if (isNaN(expiresNumber)) {
            this.expiresDate = adUnit(this.adUnitName).nextExpiresDate();
            impressionsMap[this.adUnitNameByDepartment] = '1/' + this.expiresDate;
        } else {
            var expires = new Date(expiresNumber);

            if (now < expires) {
                if (adUnit(this.adUnitName).max_Impressions != -1) {
                    var numOfImpressions = (parseInt(adUnit(this.adUnitName).getNumOfImpressions()) + 1).toString();
                    var maxImpressionsPeriod = adUnit(this.adUnitName).maxImpressionsPeriod();
                    impressionsMap[this.adUnitNameByDepartment] = numOfImpressions + '/' + this.expiresDate;
                }
            } else {
                this.expiresDate = adUnit(this.adUnitName).nextExpiresDate();
                impressionsMap[this.adUnitNameByDepartment] = '1/' + this.expiresDate;
            }
		//if after page loaded, should update impressions again
		if (isDocumentLoaded == true){
			adUnit("allAdUnits").setNumOfImpressions();
		}

        }
    }

    adUnitDFP.prototype.hasMoreImpressions = function() {
        //if it is not define on adUnitFrequencyMap return true
        if (adUnit(this.adUnitName).max_Impressions == -1) {
            return true;
        }

        //return true if has less impressions than the max impressions.
        var _hasMoreImpressions = parseInt(adUnit(this.adUnitName).getNumOfImpressions()) <= parseInt(adUnit(this.adUnitName).max_Impressions);
        return _hasMoreImpressions;
    }

    /* check with regular expression if referrer match the pattern of the invlaid domains 
     */
    adUnitDFP.prototype.hasValidReferrer = function() {
        var pattern = (!!window.invalidReferrer && (typeof invalidReferrer[this.adUnitName] != "undefined")) ? (invalidReferrer[this.adUnitName].replace(/,/g, '|').replace(/\s/g, '')) : "";
        var regexPattern = new RegExp(pattern);
        return (!!pattern) ? (!regexPattern.test(document.referrer)) : true;
    }

    adUnitDFP.prototype.setNumOfImpressions = function() {
        var allAdUnitImpressions = "";

        for (var adUnitimpression in impressionsMap) {
            if (adUnitimpression != "") {
                allAdUnitImpressions = allAdUnitImpressions + adUnitimpression + ' = ' + impressionsMap[adUnitimpression] + ";";
            }
        }
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("impressions", allAdUnitImpressions);
        }

	if (typeof setCookie == 'function'){
    		//delete cookie 'impressions' from all sites (and use localStorage instead)
		setCookie("impressions", "", '/', siteDomain);
	}
    }


    adUnitDFP.prototype.isMaavaron = function() {
        return (this.adUnitName.indexOf(".web.maavaron") != -1);
    }


    adUnitDFP.prototype.show = function() {

            //remove hidden class from wrapper
            if ($(document.getElementById(this.adUnitName))) {
                $(document.getElementById(this.adUnitName)).removeClass('h-hidden');
            }

            //maavaron use syncronic request by definePassback
            if ((typeof adUnit(this.adUnitName).isMaavaron != "undefined") && adUnit(this.adUnitName).isMaavaron() && (!document.referrer.match('loc.haaretz'))) {
                var adUnitMaavaronPath = "";
                var adUnitMaavaronSize = [
                    [2, 1]
                ];
                if (isHomePage) {
                    adUnitMaavaronPath = ADUNIT_BASE + '/' + this.adUnitName + '/' + this.adUnitName + ADUNIT_AFFILATE;
                } else {
                    adUnitMaavaronPath = ADUNIT_BASE + '/' + this.adUnitName + '/' + this.adUnitName + ADUNIT_AFFILATE + ADUNIT_PATH_PATTREN.replace(new RegExp('%adUnit%', 'g'), this.adUnitName);
                }
                adUnitMaavaronPath = adUnitMaavaronPath.toLowerCase();
                if (!window.dfpDeclarationlaoded && (document.body.clientWidth > 1024))
                    googletag.pubads().definePassback(adUnitMaavaronPath, adUnitMaavaronSize).setTargeting('UserType', [window.dfpUserType])
                    .setTargeting('age', [window.dfpUrAe])
                    .setTargeting('stg', [window.dfpStg])
                    .setTargeting('urgdr', [window.dfpUrGdr])
                    .setTargeting('articleId', [window.dfpArticleId])
                    .display();
            } else {
                var adName = this.adUnitName;
                googletag.cmd.push(function() {
                    googletag.display(adName);
                });
            }
    }

    adUnitDFP.prototype.hide = function() {
        //add hidden class from wrapper
        if ($(document.getElementById(this.adUnitName))) {
            document.getElementById(this.adUnitName).style.display = "none";
        }

	if (!!window.conflicManagementJson){
		//because this banner is in hide - show the banner that is in conflict with
		if(!!window.conflicManagementJson[this.adUnitName]){
			var conflictingadUnit = (conflicManagementJson[this.adUnitName]['avoid']);
 			avoidAdUnits.pop(conflictingadUnit);
		}
	}

	//open out of iframe
	if ((this.adUnitName.indexOf('halfpage.floating_x')!=-1)&&($('.floating_x')[0] != undefined)){
		$('.floating_x').hide();
	}
	
    }

    adUnitDFP.prototype.refresh = function() {
        googletag.pubads().refresh([gptadslots[this.adUnitName]]);
    }

    adUnitDFP.prototype.onLoaded = function() {
        //TO DO
    }

    adUnitDFP.prototype.onEmptyCallBack = function() {
        //TO DO
    }


    adUnitDFP.prototype.refresh = function() {
        googletag.pubads().refresh([gptadslots[this.adUnitName]]);
    }

    document.addEventListener('DOMContentLoaded', function() {
        isDocumentLoaded = true;
        adUnit("allAdUnits").setNumOfImpressions();
    });

    window.onload = function() {
        if (!isDocumentLoaded) {
            adUnit("allAdUnits").setNumOfImpressions();
        }
    };

    function showDFPAd(adUnit) {
            if ($(document.getElementById(adUnit))) {
                $(document.getElementById(adUnit)).removeClass('h-hidden');
            }

        googletag.cmd.push(function() {
            googletag.display(adUnit);
        });
    }

    function refreshDFPAd(adUnit) {
        googletag.pubads().refresh([gptadslots[adUnit]]);
    }


} catch (err) {
    console.log('dfp init base error:' + err);
}