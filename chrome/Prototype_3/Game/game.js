var tiles = []
var types = ['wall', 'neutral', 'rough'];
var currentPosition = [0, 0];
var gridWidth, gridHeight = 0;
var tileSize = 30; //PIXELS
var playerTileID = 0;
var $grid;

function makeRandomGrid() {
  var gridSize = 20;
  setGridSize(gridSize, gridSize);
  for (var i = 0; i < gridSize; i++) {
    for (var a = 0; a < gridSize; a++) {
      if (i == gridSize - 1 || i == 0 || a == 0 || a == gridSize - 1) {
        makeTile('wall')
      } else {
        var type = Math.floor(Math.random() * (types.length - 1)) + 1;
        console.log(type)
        makeTile(types[type]);
      }
    }
  }
  setPlayerTile(gridSize / 2, gridSize / 2);
}

function setGridSize(w, h) {
  gridWidth = w * tileSize;
  gridHeight = h * tileSize;
  $grid.css({"width": gridWidth, "height": gridHeight});
}

//zero-indexed
function coordinateToTile(x, y) {
  return x + y * gridWidth / tileSize;
}

function makeTile(type) {
  type = type || 'neutral'
  $grid.append(tileHTML(type));
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
        var type = getTileType(coordinateToTile(i, a));
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
  if (getTileType(coordinateToTile(x,y)) == 'wall') return;
  tileFromID(playerTileID).removeClass("player");
  playerTileID = coordinateToTile(x,y);
  tileFromID(playerTileID).addClass("player");
  currentPosition = [x, y];
}

function tileFromID(id) {
  return $("#grid .tile:eq(" + id + ")");
}

$(document).ready(function() {
  $grid = $("#grid");
  makeRandomGrid();
})