function Grid() {

  var _self = this;
  _self.arduino = new Arduino(onLineReceived);
  _self.buttons = {};
  _self.coordinates = {0: [0,0], 1:[0,1], 2:[1,1], 3:[1,0]};

  function onLineReceived(str) {
      var strs = str.split(",");
      if (strs.length != 4) return;
      var id = parseInt(strs[0]);
      if (id > 3 || id < 0) return;
      if ( _self.buttons[id].touch == parseInt(strs[1]) 
           && _self.buttons[id].position == parseInt(strs[2])
           && _self.buttons[id].desiredPosition == parseInt(strs[2])) return;
      var touch = parseInt(strs[1]);
      var position = parseInt(strs[2]);
      var desiredPosition = parseInt(strs[3]);
      _self.updateValues(id,position,touch,desiredPosition);
  }

  _self.newButton = function(id, onUpdate) {
    _self.buttons[id] = new Button(id, _self.arduino, onUpdate);
  }

  _self.updateValues = function(id, position, touch, desiredPosition) {
    _self.buttons[id].updateValues(touch,position,desiredPosition);
  }

  _self.updateDesiredPos = function(i, desiredPos) {
    if (desiredPos == _self.buttons[i].desiredPosition) return;
    _self.updateValues(i, null, null, desiredPos);
    _self.buttons[i].sendTarget();
  }

  _self.updatePWMPreset = function(i, preset) {
    _self.buttons[i].updatePWMPreset(preset);
  }

  _self.coordinateLookup = function(x,y) {
    for (var key in _self.coordinates) {
      if (_self.coordinates.hasOwnProperty(key) && _self.coordinates[key].join("") == [x, y].join("")) {
          return key;
      }
    }
  }

  _self.forceSend = function(i) {
    _self.buttons[i].sendTarget();
  }

}