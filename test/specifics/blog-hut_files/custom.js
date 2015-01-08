/*custom.min*/
	
jQuery(document).ready(function($){
	//portfolio - show link
	
	$('.fdw-background').hover(
		function () {
			$(this).animate({opacity:'1'});
		},
		function () {
			//$(this).find(".check_click").attr("clickVal","1");
			$(this).animate({opacity:'0'});
		}
	);	
	
});
