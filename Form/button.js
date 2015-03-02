function Button (onUpdate) {

	var _self = this;
	_self.currentColor = '#000000';
	_self.position = 0;
	_self.touch = 0;
	_self.desiredPosition = 0;

	function onLineReceived(str) {
		var strs = str.split(',');
		if (_self.touch == parseInt(strs[0]) && _self.position == parseInt(strs[1])) return;
		_self.touch = parseInt(strs[0]);
		_self.position = parseInt(strs[1]);
		_self.desiredPosition = parseInt(strs[2]);
		onUpdate(_self);
	}

	_self.arduino = new Arduino(onLineReceived);

	function hexToR(h) {return ('000' + parseInt((cutHex(h)).substring(0,2),16)).substr(-3)}
	function hexToG(h) {return ('000' + parseInt((cutHex(h)).substring(2,4),16)).substr(-3)}
	function hexToB(h) {return ('000' + parseInt((cutHex(h)).substring(4,6),16)).substr(-3)}
	function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

	_self.changeColor = function(hex) {
		if (_self.currentColor == hex.toLowerCase()) return;
		_self.currentColor = hex.toLowerCase()

		R = hexToR(_self.currentColor);
		G = hexToG(_self.currentColor);
		B = hexToB(_self.currentColor);

		_self.arduino.writeSerial("C" + R + G + B);
	}

	_self.sendTarget = function(target) {
  	if (target <= 100 && target >= 0) 
  		_self.arduino.writeSerial("P" + parseInt(target*10));
	}

	_self.allowSlide = function() {
  	_self.arduino.writeSerial("A1");
	}

	_self.disableSlide = function() {
  	_self.arduino.writeSerial("A0");
	}
}