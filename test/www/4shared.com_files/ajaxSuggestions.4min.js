function trim(B,A){return ltrim(rtrim(B,A),A)}function ltrim(B,A){A=A||"\\s";return B.replace(new RegExp("^["+A+"]+","g"),"")}function rtrim(B,A){A=A||"\\s";return B.replace(new RegExp("["+A+"]+$","g"),"")}var ajaxSuggestions={elmIdToPresentResultsIn:"search-results",elmIdResultsContainer:"search-result-suggestions",charactersBeforeSearch:0,timeBeforeSuggest:300,sameWidthAsInputElm:false,offsetLeft:0,offsetTop:0,urlExt:"search=",addSearchTermToQueryString:true,addKeyNavigationEvents:true,hideResultsOnDocumentClick:true,enabled:true,itemClassName:"item",itemSelectedClassName:"selected",itemInsertValueIntoInputClassName:"choose-value",itemInsertValueSetFocusToInput:true,hideResultsWhenInsertValueIsSelected:true,itemSeparator:";",turnAutoCompleteOff:true,xmlHttp:null,elements:[],timer:null,currentElm:null,currentKeyEvent:null,suggestionsForElm:null,elmToPresentResultsIn:null,elmResultsContainer:null,suggestions:[],resultIndex:0,selectedItem:-1,resultsAreVisible:false,valueAddedFromResultsListToInput:true,suggestionsText:"Suggestions",closeText:"Close",jsonSuggestions:[],init:function(){this.xmlHttp=this.createXmlHttp();if(this.xmlHttp){if(typeof document.getElementsByClassName!="function"){document.getElementsByClassName=this.elmByClass}this.elements=document.getElementsByClassName("ajax-suggestion","input");this.applyEvents();this.elmToPresentResultsIn=document.getElementById(this.elmIdToPresentResultsIn);this.elmResultsContainer=document.getElementById(this.elmIdResultsContainer);if(this.addKeyNavigationEvents){this.addEvent(document,"keydown",this.navigateResults);this.addEvent(document,"keypress",this.preventDefaultForArrowKeys);this.addEvent(document,"keyup",this.preventDefaultForArrowKeys)}if(this.hideResultsOnDocumentClick){this.addEvent(document,"click",this.clearResultsElement)}}},createXmlHttp:function(){this.xmlHttp=null;if(typeof XMLHttpRequest!="undefined"){this.xmlHttp=new XMLHttpRequest()}else{if(typeof window.ActiveXObject!="undefined"){try{this.xmlHttp=new ActiveXObject("Msxml2.XMLHTTP.4.0")}catch(A){try{this.xmlHttp=new ActiveXObject("MSXML2.XMLHTTP")}catch(A){try{this.xmlHttp=new ActiveXObject("Microsoft.XMLHTTP")}catch(A){this.xmlHttp=null}}}}}return this.xmlHttp},applyEvents:function(){var B;for(var A=0;A<this.elements.length;A++){B=this.elements[A];if(this.turnAutoCompleteOff){B.setAttribute("autocomplete","off")}this.addEvent(B,"keyup",this.startSuggestionsTimer);if(this.hideResultsOnDocumentClick){this.addEvent(B,"click",this.preventInputClickBubbling)}}},startSuggestionsTimer:function(A){if(!ajaxSuggestions.enabled){return }if(!/13|27|40|37|38/.test(A.keyCode)){clearTimeout(ajaxSuggestions.timer);ajaxSuggestions.currentElm=(/input/i.test(this.nodeName))?this:A.srcElement;ajaxSuggestions.currentKeyEvent=A.keyCode;ajaxSuggestions.timer=setTimeout("ajaxSuggestions.getSuggestions()",ajaxSuggestions.timeBeforeSuggest)}},getSuggestions:function(){var B=this.currentElm.value;if(!/13|27|38|37|40/.test(this.currentKeyEvent)){var A="/network/search-suggest.jsp";if(!this.valueAddedFromResultsListToInput){ajaxSuggestions.clearResults(true)}if(B.length>this.charactersBeforeSearch&&A.length>0){this.makeSuggestionCall(B,A)}else{if(B.length==0||!this.valueAddedFromResultsListToInput){ajaxSuggestions.clearResults()}}}},makeSuggestionCall:function(F,C){var B=new RegExp(("^"+F.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")+"$"),"i");var E=false;var A;var C=C+((/\?/.test(C))?"&":"?")+this.urlExt+((this.addSearchTermToQueryString)?Base64.encode(F):"");for(var D=0;D<this.suggestions.length;D++){A=this.suggestions[D];if(B.test(A[0])&&C==A[2]){E=true;this.resultIndex=D;this.presentResult(this.suggestions[D][1]);break}}if(!E){this.createTag(C)}},scriptCounter:0,searchBase:"",createTag:function(A){this.headLoc=document.getElementsByTagName("head").item(0);this.scriptId="JscriptId"+ajaxSuggestions.scriptCounter++;this.scriptObj=document.createElement("script");this.scriptObj.setAttribute("type","text/javascript");this.scriptObj.setAttribute("charset","utf-8");this.scriptObj.setAttribute("src",this.searchBase+A+"&format=jsonp");this.scriptObj.setAttribute("id",this.scriptId);this.headLoc.appendChild(this.scriptObj)},jsonpCallback:function(A){this.resultIndex=this.suggestions.length;this.suggestions.push([this.currentValue,this.buildText(A.suggestions),this.currentURL]);this.headLoc.removeChild(this.scriptObj);if(A.suggestions.length>0){this.presentResult()}else{this.clearResults()}},buildText:function(C){this.jsonSuggestions=C;var B="<ul>";for(var A=0;A<C.length;A++){B+='<li><a href="#" onclick="ajaxSuggestions.submitForm('+A+')"'+'class="item" onmouseover="ajaxSuggestions.selectByMouseOver('+A+')" id="suggestion'+A+'">';B+=C[A];B+="</a></li>"}B+="</ul>"+"<div class='xsmall lgrey' style='padding:3px 3px 0 0;float:right;'>"+ajaxSuggestions.suggestionsText+"</div>"+"<div class='xsmall' style='position:absolute;top:0;right:0;background:#FFFFFF;height:21px'><a href='#' onclick='ajaxSuggestions.clearResults()' style='color:#585B55'>[x]"+ajaxSuggestions.closeText+"</a></div>";return B},getResults:function(){if(ajaxSuggestions.xmlHttp.readyState==4&&trim(ajaxSuggestions.xmlHttp.responseText).length>0){ajaxSuggestions.loadResults()}else{ajaxSuggestions.clearResults()}},loadResults:function(){this.resultIndex=this.suggestions.length;this.suggestions.push([this.currentValue,this.xmlHttp.responseText,this.currentURL]);this.presentResult()},presentResult:function(){this.elmToPresentResultsIn.innerHTML=this.suggestions[this.resultIndex][1];var A=this.getCoordinates();var B=this.elmResultsContainer.style;B.left=A[0]+this.offsetLeft+"px";B.top=A[1]+this.currentElm.offsetHeight+this.offsetTop+"px";if(this.sameWidthAsInputElm){B.width=this.currentElm.offsetWidth+"px"}this.applyResultEvents();B.display="block";this.resultsAreVisible=true;if(this.addKeyNavigationEvents&&/38|40/.test(this.currentKeyEvent)){if(!this.valueAddedFromResultsListToInput){this.selectedItem=-1}this.navigateResults(null,this.currentKeyEvent)}},clearResults:function(A){if(this.elmResultsContainer&&this.elmToPresentResultsIn){if(!A){this.elmResultsContainer.style.display="none";this.resultsAreVisible=false}this.elmToPresentResultsIn.innerHTML="";this.selectedItem=-1}},clearResultsElement:function(){ajaxSuggestions.clearResults()},navigateResults:function(L,M){if(ajaxSuggestions.currentElm&&ajaxSuggestions.elmToPresentResultsIn){var C=(typeof L!="undefined")?L:C;if(typeof ajaxSuggestions.elmToPresentResultsIn.getElementsByClassName!="function"){ajaxSuggestions.elmToPresentResultsIn.getElementsByClassName=ajaxSuggestions.elmByClass}var H=ajaxSuggestions.elmToPresentResultsIn.getElementsByClassName(ajaxSuggestions.itemClassName);var D=(!L&&M==38)?H.length:ajaxSuggestions.selectedItem;var M=M||C.keyCode;var E=M==38;var B=M==40;if(H.length>0&&(E||B)){if(E){if((D-1)>=0){D--}else{D=H.length-1}}else{if(B){if((D+1)<H.length){D++}else{D=0}}}var N;var J;for(var G=0;G<H.length;G++){N=H[G];J=new RegExp((ajaxSuggestions.itemSelectedClassName+"s?"),"i");N.className=N.className.replace(J,"").replace(/^\s?|\s?$/g,"")}ajaxSuggestions.selectedItem=D;var A=ajaxSuggestions.currentElm;if(D>-1){var K=H[D];var F=N.className;if(!new RegExp(ajaxSuggestions.itemSelectedClassName,"i").test(F)){K.className=F+((F.length>0)?" ":"")+ajaxSuggestions.itemSelectedClassName}A=H[D];for(var G=0;G<ajaxSuggestions.elements.length;G++){if(!isHiddenByParent(ajaxSuggestions.elements[G])){ajaxSuggestions.elements[G].value=K.innerHTML;try{ajaxSuggestions.elements[G].focus();break}catch(I){}}}}if(C){if(C.preventDefault){C.preventDefault()}else{C.returnValue=false}if(C.stopPropagation){C.stopPropagation()}else{C.cancelBubble=true}}return false}else{if(M==27){ajaxSuggestions.clearResults();try{ajaxSuggestions.currentElm.focus()}catch(I){}}}}},insertTermIntoField:function(A){var C=ajaxSuggestions.elmToPresentResultsIn.getElementsByClassName(ajaxSuggestions.itemClassName);for(var B=0;B<ajaxSuggestions.elements.length;B++){ajaxSuggestions.elements[B].value=C[A].innerHTML;try{ajaxSuggestions.elements[B].focus()}catch(D){}}},selectByMouseOver:function(D){if(ajaxSuggestions.currentElm&&ajaxSuggestions.elmToPresentResultsIn){var B=(typeof evt!="undefined")?evt:B;if(typeof ajaxSuggestions.elmToPresentResultsIn.getElementsByClassName!="function"){ajaxSuggestions.elmToPresentResultsIn.getElementsByClassName=ajaxSuggestions.elmByClass}var F=ajaxSuggestions.elmToPresentResultsIn.getElementsByClassName(ajaxSuggestions.itemClassName);var C=D;if(F.length>0){var K;var I;for(var G=0;G<F.length;G++){K=F[G];I=new RegExp((ajaxSuggestions.itemSelectedClassName+"s?"),"i");K.className=K.className.replace(I,"").replace(/^\s?|\s?$/g,"")}ajaxSuggestions.selectedItem=C;var A=ajaxSuggestions.currentElm;if(C>-1){var J=F[C];var E=K.className;if(!new RegExp(ajaxSuggestions.itemSelectedClassName,"i").test(E)){J.className=E+((E.length>0)?" ":"")+ajaxSuggestions.itemSelectedClassName}A=F[C]}if(B){if(B.preventDefault){B.preventDefault()}else{B.returnValue=false}if(B.stopPropagation){B.stopPropagation()}else{B.cancelBubble=true}}return false}else{if(keyCode==27){ajaxSuggestions.clearResults();try{ajaxSuggestions.currentElm.focus()}catch(H){}}}}},applyResultEvents:function(){if(typeof this.elmToPresentResultsIn.getElementsByClassName!="function"){this.elmToPresentResultsIn.getElementsByClassName=this.elmByClass}var A=this.elmToPresentResultsIn.getElementsByClassName(this.itemInsertValueIntoInputClassName,"a");var C;for(var B=0;B<A.length;B++){C=A[B];C.inputRef=this.currentElm;this.addEvent(C,"click",this.insertValueIntoField)}},insertValueIntoField:function(A){var E=(/a/i.test(this.nodeName))?this:A.srcElement;var B=E.inputRef;var C=E.getAttribute("href");if(!new RegExp(C).test(B.value)){B.value=((B.value.length>0&&/;/i.test(B.value))?(B.value+C):C)+ajaxSuggestions.itemSeparator}if(A.preventDefault){A.preventDefault()}else{A.returnValue=false}if(A.stopPropagation){A.stopPropagation()}else{A.cancelBubble=true}if(ajaxSuggestions.itemInsertValueSetFocusToInput){try{B.focus()}catch(D){}}if(ajaxSuggestions.hideResultsWhenInsertValueIsSelected){ajaxSuggestions.clearResults()}ajaxSuggestions.valueAddedFromResultsListToInput=true},preventInputClickBubbling:function(A){if(A.preventDefault){A.preventDefault()}else{A.returnValue=false}if(A.stopPropagation){A.stopPropagation()}else{A.cancelBubble=true}return false},preventDefaultForArrowKeys:function(A){var D=A.keyCode;var C=D==38;var B=D==40;if((!A.ctrlKey&&!A.metaKey)&&ajaxSuggestions.resultsAreVisible&&(C||B)){if(A.preventDefault){A.preventDefault()}else{A.returnValue=false}if(A.stopPropagation){A.stopPropagation()}else{A.cancelBubble=true}return false}},getCoordinates:function(){var C=this.currentElm;var B=0;var A=0;while(C.offsetParent){B+=C.offsetLeft;A+=C.offsetTop;if(C.scrollTop>0){A-=C.scrollTop}C=C.offsetParent}return[B,A]},closeSession:function(){delete ajaxSuggestions;ajaxSuggestions=null},elmByClass:function(B,A){return ajaxSuggestions.getElementsByClassName.call(this,B,A)},getElementsByClassName:function(F,A){var E=((!A||A=="*")&&this.all)?this.all:this.getElementsByTagName(A||"*");var C=[];var F=F.replace(/\-/g,"\\-");var B=new RegExp("(^|\\s)"+F+"(\\s|$)");var G;for(var D=0;D<E.length;D++){G=E[D];if(B.test(G.className)){C.push(G)}}return(C)},submitForm:function(A){ajaxSuggestions.insertTermIntoField(A);for(var B=0;B<ajaxSuggestions.elements.length;B++){if(!isHiddenByParent(ajaxSuggestions.elements[B])){var D=true;if(ajaxSuggestions.elements[B].form.onsubmit!=""&&ajaxSuggestions.elements[B].form.onsubmit!=null){try{D=ajaxSuggestions.elements[B].form.onsubmit()}catch(C){}}if(D){ajaxSuggestions.elements[B].form.submit()}break}}},addEvent:function(C,A,B){if(C){if(C.addEventListener){C.addEventListener(A,B,false)}else{if(window.attachEvent){C.attachEvent(("on"+A),B)}}}}};if(typeof $!="undefined"){$(".ajax-suggestion").ready(function(){ajaxSuggestions.init()})}else{ajaxSuggestions.addEvent(window,"load",function(){ajaxSuggestions.init()})}ajaxSuggestions.addEvent(window,"unload",function(){ajaxSuggestions.closeSession()});function isHiddenByParent(A){if(A!=null&&A.style!=null&&A.style.display=="none"){return true}var A=A.parentNode;while(A!=null){if(A!=null&&A.style!=null&&A.style.display=="none"){return true}A=A.parentNode}return false};