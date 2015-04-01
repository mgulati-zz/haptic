threeD = new Generator();
grid = new Grid();

$(function() {
  $('.tile').hover(function() {
	    $(this).children('.caption').css('bottom', '54px');
	  }, function() {
	    $(this).children('.caption').css('bottom', '0px');
	  }
	).click(function() {
		$('.tile').css('position', 'absolute');
		$(this).parent().children('.tile').css('top','80%');
		// $(this).css({'top':'100px'});
		$(this).css({'position':'static','float':'left'});
	});
})