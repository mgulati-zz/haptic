// var fromUpdate = false;

var button = new Button(function(btn) {
	var volume = btn.desiredPosition * 0.1;
  // fromUpdate = true;
	$('.single-slider').jRange('setValue', volume);
});
button.allowSlide();

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function changeVolume() {
	//console.log('slider UI ' + $('.single-slider').val());
  var sliderVal = $('.single-slider').val()
  
  //stop arduino fuckery from crashing the app
  if (sliderVal > 100 || isNaN(sliderVal)) {
    $('audio')[0].volume = 1;
  } else {
    $('audio')[0].volume = sliderVal * 0.01;
  }
	var volume = $('audio')[0].volume;

	var red = parseInt(255 * (1 - volume));
  var green = parseInt(255 * volume);
  var blue = 0;
	button.changeColor(rgbToHex(red,green,blue));

  // if (fromUpdate == false) button.sendTarget(volume * 100);
  // else fromUpdate = false;
}

function toggleState() {
	if ($(".fa").hasClass('fa-play')) {
		$(".fa").removeClass('fa-play');
		$(".fa").addClass('fa-pause');
		$('audio')[0].play();
	}
	else {
		$(".fa").removeClass('fa-pause');
		$(".fa").addClass('fa-play');
		$('audio')[0].pause();
	}
}

$(document).ready(function(){
  $('.single-slider').jRange({
      from: 0,
      to: 100,
      step: 1,
      format: '%s',
      width: 500,
      showLabels: true,
      onstatechange: changeVolume
  });

  $('.clickable-dummy').click(function(e) {
    button.sendTarget($('.single-slider').val())
  });

  $('audio')[0].volume = $('.single-slider').val() * 0.01;

  $(".fa").click(function(){
		toggleState();
	})

});