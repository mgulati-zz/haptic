var counter = 0
var color = "#000000"
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

	color = "#000000";
	if (volume == 1 ) color = "#ffffff";
	if (volume < 1 ) color = "#0000ff";
	if (volume < 0.50 ) color = "#00ff00";
	if (volume < 0.25 ) color = "#ff0000";
	if (volume == 0 ) color = "#000000";
  if (color == "#000000") {
    console.warn("BAD")
  }
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
  $('.clickable-dummy').click(function() {
    sendTarget($('.single-slider').val())
  });

  $('audio')[0].volume = $('.single-slider').val() * 0.01;

  $(".fa").click(function(){
		toggleState();
	})

  setInterval(function() {
    changeColor(color)
  }, 100);
});

var connectionId;

function writeSerial(str) {

	chrome.serial.send(connectionId, convertStringToArrayBuffer(str), function(){ console.log("write "+ str) });
}

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

function changeColor(hex) {
	R = hexToR(hex);
	G = hexToG(hex);
	B = hexToB(hex);

	writeSerial("R" + R + "\n");
	writeSerial("G" + G + "\n");
	writeSerial("B" + B + "\n");
}

function sendTarget(target) {
  if (target <= 100 && target >= 0) writeSerial("P" + target*10 + "\n");
}

function onConnect(connectionInfo) {
	connectionId = connectionInfo.connectionId;
}
chrome.serial.connect("/dev/tty.usbmodem1421", {bitrate: 9600}, onConnect);

// Convert string to ArrayBuffer
function convertStringToArrayBuffer(str) {
  var buf=new ArrayBuffer(str.length);
  var bufView=new Uint8Array(buf);
  for (var i=0; i<str.length; i++) {
    bufView[i]=str.charCodeAt(i);
  }
  return buf;
}

var stringReceived = '';

function onLineReceived(str) {
	var strs = str.split(',');
	var touch = parseInt(strs[0]);
	var pos = parseInt(strs[1]);
	var volume = pos * 0.1;
	$('.single-slider').jRange('setValue', volume);
}

/* Interprets an ArrayBuffer as UTF-8 encoded string data. */
function convertArrayBufferToString(buf) {
  var bufView = new Uint8Array(buf);
  var encodedString = String.fromCharCode.apply(null, bufView);
  return encodedString;
};

function onReceiveCallback(info) {
  if (info.data) {
    var str = convertArrayBufferToString(info.data);
    if (str.charAt(str.length-1) === '\n') {
      stringReceived += str.substring(0, str.length-1);
      stringsRecieved = stringReceived.split('\n');
      stringsRecieved.forEach(function(strRec) {
      	onLineReceived(strRec);
      })
      stringReceived = '';
    } else {
      stringReceived += str;
    }
  }
};

chrome.serial.onReceive.addListener(onReceiveCallback);



