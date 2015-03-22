var tiles = []
var presetLevel = [
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,-1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
0,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,
0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,0,
0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
0,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
0,1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,
0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0,
0,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,
0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
0,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,
0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
]

var types = ['wall', 'neutral', 'rough'];
var currentPosition = [0, 0];
var gridWidth, gridHeight = 0;
var tileSize = 30; //PIXELS
var playerTileID = 0;
var $level;

function makeRandomGrid() {
  var gridSize = 20;
  setGridSize(gridSize, gridSize);
  for (var i = 0; i < gridSize; i++) {
    for (var a = 0; a < gridSize; a++) {
      if (i == gridSize - 1 || i == 0 || a == 0 || a == gridSize - 1) {
        makeTile('wall')
      } else {
        var type = Math.floor(Math.random() * (types.length - 1)) + 1;
        makeTile(types[type]);
      }
    }
  }
  setPlayerTile(gridSize / 2, gridSize / 2);
}
function makePresetGrid() {
  var gridSize = 20;
  setGridSize(gridSize, gridSize);
  for (var i = 0; i < presetLevel.length; i++) {
    var type = presetLevel[i];
    if (type == -1) {
      makeTile('neutral');
      var coord = IDToCoordinate(i)
      setPlayerTile(coord[0], coord[1]);
    } else {
      makeTile(types[type]);
    }
  }
}

function setGridSize(w, h) {
  gridWidth = w * tileSize;
  gridHeight = h * tileSize;
  $level.css({"width": gridWidth, "height": gridHeight});
}

//zero-indexed
function coordinateToID(x, y) {
  return x + y * gridWidth / tileSize;
}

function IDToCoordinate(id) {
  var size = gridWidth / tileSize;
  var x = id % size
  var y = (id - id % size) / size 
  return [x,y];
}

function makeTile(type) {
  type = type || 'neutral'
  $level.append(tileHTML(type));
}

function assignTile(id, type) {
  var $tile = tileFromID(id)
  $tile.removeClass($tile.attr("data-type"));
  $tile.addClass(type);
  $tile.attr("data-type", type);
}

function getTileType(id) {
  return tileFromID(id).attr("data-type");
}

//x and y range from -1 to 1
function moveDirection(x,y) {
  setPlayerTile(currentPosition[0] + x, currentPosition[1] - y);
}

function determineActions() {
  var actions = []
  var x = currentPosition[0];
  var y = currentPosition[1];
  for (var i = x-1; i <= x + 1; i++) {
    for (var a = y-1; a <= y + 1; a++) {
      if (a != y || i != x) {
        var type = getTileType(coordinateToID(i, a));
        if (type == 'wall') {
          actions.push(0);
        } else if (type == 'neutral') {
          actions.push(1);
        } else if (type == 'rough') {
          actions.push(2);
        }
      } 
    }
  }
  return actions
}

function tileHTML(type) {
  return "<div class='" + type + " tile' data-type='" + type + "'></div>"
}

function setPlayerTile(x, y) {
  if (getTileType(coordinateToID(x,y)) == 'wall') return;
  tileFromID(playerTileID).removeClass("player");
  playerTileID = coordinateToID(x,y);
  tileFromID(playerTileID).addClass("player");
  currentPosition = [x, y];
}

function tileFromID(id) {
  return $("#grid .tile:eq(" + id + ")");
}

function updatePixels(available) {
  for (var i = 0; i < available.length; i++) {
    if (available[i] > 0) {
      grid.updateDesiredPos(i, 1000);
    } else {
      grid.updateDesiredPos(i, 500);
    }
  }
}

function pixelUpdated(pixel) {
  if (pixel.touch > 0) {
    var coords = IDToCoordinate(pixel.id);
    moveDirection(coords[0] - 1, -(coords[1] - 1))
    var actions = determineActions();
    updatePixels(actions);
  }
}

var grid = new Grid();

$(document).ready(function() {
  $level = $("#grid");
  makePresetGrid();
  $(window).keyup(function(e) {
    if (e.which == 38 || e.which == 37 || e.which == 39 || e.which == 40) {
      e.preventDefault();
      if (e.which == 38) {
        moveDirection(0, 1);
      } else if (e.which == 39) {
        moveDirection(1, 0)
      } else if (e.which == 40) {
        moveDirection(0, -1)
      } else if (e.which == 37) {
        moveDirection(-1, 0)
      }
      var actions = determineActions();
      updatePixels(actions);
    }
  });

  for (var i = 0; i < 9; i++) {
    grid.newButton(i, pixelUpdated);
  }
})