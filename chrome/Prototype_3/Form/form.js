var year = 1980;
var month = 0;
var day = 0;

threeD = new Generator();
grid = new Grid();

for (var i = 0; i < 9; i++) {
  grid.newButton(i, physicalUpdateHandler);
}

function physicalUpdateHandler(button) {
  var coordinates = grid.indexLookup(button.id);
  threeD.setPos(coordinates[0], coordinates[1], button.position / 1000, false);
  threeD.setDesiredPos(coordinates[0], coordinates[1], button.desiredPosition / 1000, false);
  slideHandle(coordinates[0],coordinates[1],button.desiredPosition / 1000);
}

function setColor(x,z,color) {
  threeD.setLEDColor(x,z,color);
  grid.updateColor(grid.coordinateLookup(x,z),color);
}

function initializeForm() {
  //buttons
  setColor(2,2,'#808080')
  setColor(2,0,'#808080');
  grid.updateDesiredPos(grid.coordinateLookup(2,2),200);
  grid.updateDesiredPos(grid.coordinateLookup(2,0),200);

  //sliders
  grid.updateDesiredPos(grid.coordinateLookup(0,0),700);
  grid.updateDesiredPos(grid.coordinateLookup(0,1),700);
  grid.updateDesiredPos(grid.coordinateLookup(0,2),700);

  //values
  $('.matrix .element-4').text('0');
  $('.matrix .element-5').text('0');
  $('.matrix .element-6').text('1980');
}

function beforeDrag(x,z) {
  return true;
}

function mouseDrag(x,z,pos) {
  grid.updateDesiredPos(grid.coordinateLookup(x,z),pos*1000);
}

function slideHandle(x,z,pos) {
  if (x == 0) {
    updateBirthDate(z, pos);
  }
  else if (pos < 0.2) clickHandle(x,z);
}

function clickHandle(x,z) {
  if (x == 2 && z == 0) initializeForm();
  if (x == 2 && z == 2 && year != 0 && month != 0 && day != 0) {
    //success
  }
}

function updateBirthDate (metric, percent) {
  percent = (0.7 - percent);
  if (metric == 0) {
    year = Math.floor((percent*50) + 1980);
    $('.matrix .element-6').text(year);
  } else if (metric == 1) {
    month = Math.ceil(percent*17.14);
    if (percent <= 0) month = 0;
    $('.matrix .element-5').text(month);
  } else if (metric == 2) {
    day = Math.ceil(percent*44.28);
    if (percent <= 0) day = 0;
    $('.matrix .element-4').text(day);
  }

  if (day != 0 || month != 0 || year != 1980) {
    setColor(2,0,'#ff0000');
    grid.updateDesiredPos(grid.coordinateLookup(2,0),500);
  } else {
    setColor(2,0,'#808080');
    grid.updateDesiredPos(grid.coordinateLookup(2,0),200);
  }
  if (year != 0 && day != 0 && month != 0) {
    setColor(2,2,'#00FF7F');
    grid.updateDesiredPos(grid.coordinateLookup(2,2),500);
  } else {
    setColor(2,2,'#808080');
    grid.updateDesiredPos(grid.coordinateLookup(2,2),200);
  }
}
  
$(function() {
  threeD.makeHaptic(3,3,10,3,0.5,1, mouseDrag, null, clickHandle, beforeDrag);
  threeD.setZoom(1.5);
  initializeForm();
})