function Button (onUpdate) {

	var _self = this;
	_self.currentColor = '#000000';
	_self.position = 0;
	_self.touch = 0;

	function onLineReceived(str) {
		var strs = str.split(',');
		if (_self.touch == parseInt(strs[0]) && _self.position == parseInt(strs[1])) return;
		_self.touch = parseInt(strs[0]);
		_self.position = parseInt(strs[1]);
		onUpdate(_self);
	}

	_self.arduino = new Arduino(onLineReceived);

	function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
	function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
	function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
	function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

	_self.changeColor = function(hex) {
		if (_self.currentColor == hex.toLowerCase()) return;
		_self.currentColor = hex.toLowerCase()

		R = hexToR(_self.currentColor);
		G = hexToG(_self.currentColor);
		B = hexToB(_self.currentColor);

		_self.arduino.writeSerial("R" + R + "\n");
		_self.arduino.writeSerial("G" + G + "\n");
		_self.arduino.writeSerial("B" + B + "\n");
	}
}