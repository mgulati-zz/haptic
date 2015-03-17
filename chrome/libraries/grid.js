function Grid() {

  var _self = this;
  _self.arduino = null;//new Arduino(onLineReceived);
  _self.buttons = {};

  function onLineReceived(str) {
    var strs = str.split(',');
    var id = parseInt(strs[0]);
    if (_self.buttons[id].touch == parseInt(strs[1]) && _self.buttons[id].position == parseInt(strs[2])) return;
    var touch = parseInt(strs[1]);
    var position = parseInt(strs[2]);
    var desiredPosition = parseInt(strs[3]);
    _self.updateValues(id,touch,position,desiredPosition);
  }

  _self.newButton = function(id, onUpdate) {
    _self.buttons[id] = new Button(id, _self.arduino, onUpdate);
  }

  _self.updateValues = function(id, position, touch, desiredPosition) {
    if (touch == null) touch = _self.buttons[id].touch;
    if (position == null) position = _self.buttons[id].position;
    if (desiredPosition == null) desiredPosition = _self.buttons[id].desiredPosition;
    _self.buttons[id].updateValues(touch,position,desiredPosition);
  }

  _self.updateDesiredPos = function(i, desiredPos) {
    _self.updateValues(i, null, null, desiredPos);
  }

}