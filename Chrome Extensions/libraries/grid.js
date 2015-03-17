function Grid() {

  var _self = this;
  _self.arduino = new Arduino(onLineReceived);
  _self.buttons = {};

  function onLineReceived(str) {
    var strs = str.split(',');
    var id = parseInt(strs[0]);
    if (_self.buttons[id].touch == parseInt(strs[1]) && _self.buttons[id].position == parseInt(strs[2])) return;
    var touch = parseInt(strs[1]);
    var position = parseInt(strs[2]);
    var desiredPosition = parseInt(strs[3]);
    _self.buttons[id].updateValues(touch,position,desiredPosition);
  }

  function newButton(id, onUpdate) {
    _self.buttons[id] = new Button(id, _self.arduino, onUpdate);
  }
}