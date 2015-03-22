var connected = false;

generator = new Generator();

grid = new Grid();
var soundBoardCoordinates = {0: [0,0], 1:[0,2], 2:[2,0], 3:[2,2]};
function formLookup (x,y) {
  for (var key in soundBoardCoordinates) {
    if (soundBoardCoordinates.hasOwnProperty(key) && soundBoardCoordinates[key].join("") == [x, y].join("")) {
        return key;
    }
  }
}
for (var i = 0; i < 4; i++) {
  grid.newButton(i, function(button) {
    var coordinates = soundBoardCoordinates[button.id];
    generator.setPos(coordinates[0], coordinates[1], button.position / 1000, false);
    physicalSlideHandle(coordinates[0],coordinates[1],button.position / 1000);
    if (connected == false) {
      connected = true;
      initializeBoard();
    }
  });
}

function initializeBoard() {
  //buttons
  var colors = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","DarkOrange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","RebeccaPurple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"]
  for (var i=0; i<3; i++) {
     for (var j=0; j<3; j++) {
        generator.setLEDColor(i,j,colors[Math.floor(Math.random() * colors.length)]);
     }
  }
}

function beforeDrag(x,z) {
  return true;
}

function mouseDrag(x,z,pos) {

}

function mouseDragEnd(x,z,pos) {

}

function physicalSlideHandle(x,z,pos) {

}

function clickHandle(x,z) {
  var index = grid.coordinateLookup(x,z);
  var audio = $('#audio-' + index)[0];
  audio.play();
  $(audio).on('timeupdate', function(e) {
    var percentDone = audio.currentTime/audio.duration;
    generator.setDesiredPos(x,z,1 - percentDone);
  })  
}

$(function() {
  generator.makeHaptic(3,3,10,3,0.5,1, mouseDrag, mouseDragEnd, clickHandle, beforeDrag);
  generator.setZoom(1.75);
  initializeBoard();
})