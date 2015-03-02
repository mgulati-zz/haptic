
function logIn() {
	console.log('here');
}

$(document).ready(function(){
  
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
	str.split(',');
	var touch = parseInt(str[0]);
	var pos = parseInt(str[1]);
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



