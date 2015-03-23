function Button (id, arduino, onUpdate) {

	var _self = this;
	_self.currentColor = '#000000';
	_self.position = 0;
	_self.touch = 0;
	_self.desiredPosition = 0;
	_self.arduino = arduino;
	_self.id = id;
	_self.pwmPreset = 0;

	_self.updateValues = function(touch, position, desiredPosition) {
		if ((_self.touch == touch || touch == null)
			&& (_self.position == position || position == null)
			&& (_self.desiredPosition == desiredPosition || desiredPosition == null)) return;
		_self.touch = (touch == null)? _self.touch:touch;
    _self.position = (position == null)? _self.position:position;
    _self.desiredPosition = (desiredPosition == null)? _self.desiredPosition : desiredPosition;
		onUpdate(_self);
	}

	_self.updatePWMPreset = function(preset) {
		if (preset != _self.pwmPreset) {
			_self.arduino.writeSerial(_self.id + "S" + preset);
		}
		_self.pwmPreset = preset;
	}

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

		_self.arduino.writeSerial(_self.id + "C" + R + G + B);
	}

	_self.sendTarget = function() {
		//if (parseInt(target) == _self.desiredPosition) return;
  	//if (target <= 1000 && target >= 20) {
  		//_self.desiredPosition = parseInt(target);
		_self.arduino.writeSerial(_self.id + "P" + _self.desiredPosition);
  	//}
	}

	_self.allowSlide = function() {
  	_self.arduino.writeSerial(_self.id + "A1");
	}

	_self.disableSlide = function() {
  	_self.arduino.writeSerial(_self.id + "A0");
	}
}