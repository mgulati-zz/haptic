function Grid() {

  var _self = this;
  _self.arduino = new Arduino(onLineReceived);
  _self.buttons = {};
  
  var coordinates = {0: [0,0], 1:[0,1], 2:[0,2], 3:[1,0], 4:[1,1], 5:[1,2], 6:[2,0], 7:[2,1], 8:[2,2]};

  function onLineReceived(str) {
    var strs = str.split(",");
    if (strs.length != 5) return;
    var id = parseInt(strs[0]);
    if (id > _self.buttons.length || id < 0) return;
    if ( _self.buttons[id].touch == parseInt(strs[1]) 
         && _self.buttons[id].position == parseInt(strs[2])
         && _self.buttons[id].desiredPosition == parseInt(strs[3])
         && _self.buttons[id].pwmAction == parseInt(strs[4])) return;
    var touch = parseInt(strs[1]);
    var position = parseInt(strs[2]);
    var desiredPosition = parseInt(strs[3]);
    var pwmAction = parseInt(strs[4]);
    _self.updateValues(id,touch, position, desiredPosition, pwmAction);
  }

  _self.newButton = function(id, onUpdate) {
    _self.buttons[id] = new Button(id, _self.arduino, onUpdate);
  }

  _self.updateValues = function(id, touch, position, desiredPosition, pwmAction) {
    _self.buttons[id].updateValues(touch, position, desiredPosition, pwmAction);
  }

  _self.updateColor = function(id, hex) {
    _self.buttons[id].changeColor(hex);
  }
  _self.updateColorRGB = function(id, R, G, B) {
    _self.buttons[id].changeColorRGB(R,G,B);
  }

  _self.updateDesiredPos = function(i, desiredPos) {
    if (desiredPos == _self.buttons[i].desiredPosition) return;
    _self.updateValues(i, null, null, desiredPos, null);
    _self.buttons[i].sendTarget();
  }

  _self.updatePIDPreset = function(i, preset) {
    _self.buttons[i].updatePIDPreset(preset);
  }

  _self.coordinateLookup = function(x,y) {
    for (var key in coordinates) {
      if (coordinates.hasOwnProperty(key) && coordinates[key].join("") == [x, y].join("")) {
          return key;
      }
    }
  }

  _self.indexLookup = function(i) {
    return coordinates[i];
  }

  _self.forceSend = function(i) {
    _self.buttons[i].sendTarget();
  }

}