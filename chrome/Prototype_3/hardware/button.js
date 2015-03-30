function Button (id, arduino, onUpdate) {

	var _self = this;
	_self.currentColor = '000000000';
	_self.touch = 0;
	_self.position = 0;
	_self.lastPosition = 0;
	_self.desiredPosition = 0;
	_self.pwmAction = 0;
	_self.arduino = arduino;
	_self.id = id;
	_self.pwmPreset = 0;

	_self.updateValues = function(touch, position, desiredPosition, pwmAction) {
		if ((_self.touch == touch || touch == null)
			&& (_self.position == position || position == null)
			&& (_self.desiredPosition == desiredPosition || desiredPosition == null)
			&& (_self.pwmAction == pwmAction || pwmAction == null)) return;
		_self.touch = (touch == null)? _self.touch:touch;
		_self.lastPosition = (position == null)? _self.lastPosition : _self.position;
	    _self.position = (position == null)? _self.position : position;
	    _self.desiredPosition = (desiredPosition == null)? _self.desiredPosition : desiredPosition;
	    _self.pwmAction = (pwmAction == null)? _self.pwmAction : pwmAction;
		onUpdate(_self);
	}

	_self.updatePIDPreset = function(preset) {
		if (preset != _self.pwmPreset) {
			_self.arduino.writeSerial(_self.id + "S" + preset);
		}
		_self.pwmPreset = preset;
	}

	function hexToR(h) {return parseInt(cutHex(h).substring(0,2),16)}
	function hexToG(h) {return parseInt(cutHex(h).substring(2,4),16)}
	function hexToB(h) {return parseInt(cutHex(h).substring(4,6),16)}
	function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

	zeroPad = function(num, digits) {
		return ('000000' + parseInt(num)).substr(-1*digits);
	}

	_self.changeColor = function(hex) {
		R = hexToR(hex);
		G = hexToG(hex);
		B = hexToB(hex);

		_self.changeColorRGB(R,G,B);
	}

	_self.changeColorRGB = function(R,G,B) {
		var colorString = zeroPad(R,3) + zeroPad(G,3) + zeroPad(B,3);
		if (_self.currentColor == colorString) return;
		_self.currentColor = colorString;
		_self.arduino.writeSerial(_self.id + "C" + colorString);
	}

	_self.sendTarget = function() {
		//if (parseInt(target) == _self.desiredPosition) return;
  	//if (target <= 1000 && target >= 20) {
  		//_self.desiredPosition = parseInt(target);
		_self.arduino.writeSerial(_self.id + "P" + zeroPad(_self.desiredPosition,4));
  	//}
	}

	_self.allowSlide = function() {
  	_self.arduino.writeSerial(_self.id + "A1");
	}

	_self.disableSlide = function() {
  	_self.arduino.writeSerial(_self.id + "A0");
	}
}