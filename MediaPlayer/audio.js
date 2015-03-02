var button = new Button(function(btn) {
	var volume = btn.position * 0.1;
	$('.single-slider').jRange('setValue', volume);
	$('audio')[0].volume = volume;
});

function changeVolume() {
	console.log('slider UI ' + $('.single-slider').val());
	$('audio')[0].volume = $('.single-slider').val() * 0.01;
	var volume = $('audio')[0].volume;

	var color = "#000000";
	if (volume == 1 ) color = "#ffffff";
	if (volume < 0.75 ) color = "#0000ff";
	if (volume < 0.50 ) color = "#00ff00";
	if (volume < 0.25 ) color = "#ff0000";
	if (volume == 0 ) color = "#000000";
	button.changeColor(color);
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
  $('audio')[0].volume = $('.single-slider').val() * 0.01;

  $(".fa").click(function(){
		toggleState();
	})
});