var originalUploadElementsContent=null;function hasUploadElement(A){return document.getElementById("fid"+A)!=null}function restoreUploadElements(){if(originalUploadElementsContent!=null){$("#fileTR").parent().html(originalUploadElementsContent)}}function deldir(B,A){delImpl(B,A,1)}function deldirPerm(B,A){delImplPerm(B,A,1)}function delfile(B,A){delImpl(B,A,2)}function delImpl(D,B,A){var C=msgConfirmDel;C=C.replace("$[p1]",'"'+B+'"');if(window.confirm(C)){if(A==1){document.theForm.deldir.value=D}else{document.theForm.delfile.value=D}document.theForm.submit()}}function delfilePerm(B,A){delImplPerm(B,A,2)}function delImplPerm(C,B,A){delImplPermForForm(C,B,A,document.theForm)}function delImplPermForForm(E,C,A,B){var D=msgConfirmDelPerm;D=D.replace("$[p1]",'"'+C+'"');if(window.confirm(D)){if(A==1){B.deldir.value=E}else{if(A==2){B.delfile.value=E}else{B.delmessage.value=E}}B.submit()}}if(navigator.userAgent.indexOf("iPhone")!=-1){addEventListener("load",function(){setTimeout(hideURLbar,0)},false)}function hideURLbar(){window.scrollTo(0,1)}function classicView(){document.cookie="classicView=true; path=/; domain="+encodeURIComponent(Config.cookieDomain);window.location.reload()}function pagerShowFiles(B){var A=location;location.replace(A+"&firstFileToShow="+B)}function hidePassBlock(){$(".jsChangePwdBlArr").removeClass("opened");clearPassBlock()}function clearPassBlock(){$(":password",".jsChangePasswordBlock").each(function(){$(this).val("")})}function hideEmailBlock(){$(".jsChangeEmailBlArr").removeClass("opened");clearEmailBlock()}function clearEmailBlock(){$(":text, :password",".jsChangeEmailBlock").each(function(){$(this).val("")})}function validateNewPass(){$(".jsChangePasswordError").hide();var A=true;$(":password",".jsChangePasswordBlock").each(function(){if(!$(this).val()){$(this).focus().closest("div").next().show();A=false}});var C=$('input[name="newPassword"]').val();var B=$('input[name="newPassword2"]').val();if(C!=B){A=false;$("#passDoNotMatch").show()}else{if(C==B==""){A=false}}return A}function savePasswordChanges(){if(validateNewPass()){sendPasswordUpdate($('input[name="password"]').val(),$('input[name="newPassword"]').val())}}function sendPasswordUpdate(A,B){$.getJSON("/account/updatePassword.jsp",{currPass:A,newPass:B},function(C){if(C&&C.comment){alert(C.comment);clearPassBlock()}if(C.res){hidePassBlock()}});return false}function renewPassword(){if(validateNewPass()){$('form[name="rnPwdForm"]').submit()}}$('input[type="text"]').filter(":first").focus();$(function(){$(".paidPlanList").click(function(){$(this).addClass("showHidden")});$(".jsAllowSearch").click(function(){var A=$(this).attr("data-allow")==="true";$.get("/web/account/setAllowSearch?allow="+A,function(){window.location.reload()})})});