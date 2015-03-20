var year = 1980;
var month = 0;
var day = 0;
var connected = false;

generator = new Generator();

grid = new Grid();
var formCoordinates = {0: [0,0], 1:[0,2], 2:[2,0], 3:[2,2]};
function formLookup (x,y) {
  for (var key in formCoordinates) {
    if (formCoordinates.hasOwnProperty(key) && formCoordinates[key].join("") == [x, y].join("")) {
        return key;
    }
  }
}
for (var i = 0; i < 4; i++) {
  grid.newButton(i, function(button) {
    var coordinates = formCoordinates[button.id];
    generator.setPos(coordinates[0], coordinates[1], button.position / 1000, false);
    physicalSlideHandle(coordinates[0],coordinates[1],button.position / 1000);
    if (connected == false) {
      connected = true;
      initializeForm();
    }
  });
}

function initializeForm() {
  //buttons
  generator.setLEDColor(2,2,'rgb(128, 128, 128)');
  generator.setLEDColor(2,0,'rgb(128, 128, 128)');
  grid.updateDesiredPos(formLookup(2,2),200);
  grid.updateDesiredPos(formLookup(2,0),200);

  //sliders
  grid.updateDesiredPos(formLookup(0,0),700);
  grid.updateDesiredPos(formLookup(0,2),700);
  generator.setDesiredPos(0,1,0.7);
  generator.setPos(0,1,0.7, true);

  //values
  $('.matrix .element-4').text('');
  $('.matrix .element-5').text('');
  $('.matrix .element-6').text('');
}

function beforeDrag(x,z) {
  return (x == 0)
}

function mouseDrag(x,z,pos) {
  if (x == 0 && z != 1)
    grid.updateDesiredPos(formLookup(x,z),pos*1000);
}

function mouseDragEnd(x,z,pos) {
  if (x == 0 && z == 1) {
    generator.setPos(x,z,pos,true);
    updateBirthDate(z,pos);
  }
}

function physicalSlideHandle(x,z,pos) {
  if (x == 0) {
    updateBirthDate(z, pos);
    // grid.updateDesiredPos(formLookup(x,z), pos*1000);
  }
  else if (pos < 0.2) clickHandle(x,z);
}

function clickHandle(x,z) {
  if (x == 2 && z == 2) initializeForm();
  if (x == 2 && z == 0 && year != 0 && month != 0 && day != 0) {
    // formSubmit();
  }
}

function updateBirthDate (metric, percent) {
  percent = (0.7 - percent);
  if (metric == 0) {
    year = Math.floor((percent*50) + 1980);
    $('.matrix .element-6').text(year);
  } else if (metric == 1) {
    if (percent <= 0) {
      month = 0
      $('.matrix .element-5').text('');
    }
    else {
        month = Math.ceil(percent*17.14);
        $('.matrix .element-5').text(month);
      }
  } else if (metric == 2) {
    if (percent <= 0) {
      day = 0
      $('.matrix .element-4').text('');
    }
    else {
      day = Math.ceil(percent*44.28);
      $('.matrix .element-4').text(day);
    }
  }

  if (day != 0 || month != 0) {
    generator.setLEDColor(2,2,'rgb(250, 6, 6)');
    grid.updateDesiredPos(formLookup(2,2),500);
  } else {
    generator.setLEDColor(2,2,'rgb(128, 128, 128)');
    grid.updateDesiredPos(formLookup(2,2),200);
  }
  if (year != 0 && day != 0 && month != 0) {
    generator.setLEDColor(2,0,'rgb(0, 255, 127)');
    grid.updateDesiredPos(formLookup(2,0),500);
  } else {
    generator.setLEDColor(2,0,'rgb(128, 128, 128)');
    grid.updateDesiredPos(formLookup(2,0),200);
  }
}
  
$(function() {
  generator.makeHaptic(3,3,10,3,0.5,1, mouseDrag, mouseDragEnd, clickHandle, beforeDrag);
  generator.setZoom(1.5);
})