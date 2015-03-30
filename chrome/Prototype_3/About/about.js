threeD = new Generator();
grid = new Grid();

$(function() {
  $('.tile').hover(function() {
	    $(this).children('.caption').css('bottom', '54px');
	  }, function() {
	    $(this).children('.caption').css('bottom', '0px');
	  }
	).click(function() {
		$(this).parent().children('.tile').css('top','80%');
		$(this).css({'top':'100px', 'left':'100px'});
	});
})