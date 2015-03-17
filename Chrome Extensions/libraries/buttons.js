function Buttons (arduino) {

  var _self = this;
  _self.arduino = arduino;
  self.buttons = {};

  function onLineReceived(str) {
    var strs = str.split(',');
    var id = parseInt(strs[0]);
    if (buttons[id].touch == parseInt(strs[1]) && buttons[id].position == parseInt(strs[2])) return;
    var touch = parseInt(strs[1]);
    var position = parseInt(strs[2]);
    var desiredPosition = parseInt(strs[3]);
    buttons[id].updateValues(touch,position,desiredPosition);
  }

  function newButton(id, onUpdate) {
    buttons[id] = new Button(id, arduino, onUpdate);
  }
}