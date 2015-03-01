function changeVolume() {
	console.log($('.single-slider').val());
	$('audio')[0].volume = $('.single-slider').val() * 0.01;
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
		console.log('hereeee');
		toggleState();
	})

	var onConnect = function(connectionInfo) {
		console.log(connectionInfo.connectionId);
   	// The serial port has been opened. Save its id to use later.
	  // _this.connectionId = connectionInfo.connectionId;
	  // Do whatever you need to do with the opened port.
	}
	chrome.serial.connect("/dev/tty.usbmodem1421", {bitrate: 9600}, onConnect);

});

