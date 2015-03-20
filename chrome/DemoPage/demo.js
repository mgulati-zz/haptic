$(document).ready(function() {
  window.grid = new Grid();
  for (var i = 0; i < 4; i++) {
    grid.newButton(i, function(button) {
      $slider = $(".slide:eq(" + button.id +")");
      var coordinates = grid.coordinates[button.id];
      setPos(coordinates[0], coordinates[1], button.position / 1000, true);
    });
  }
});






//MAYANK'S STUFF

var slideLimit = 1;

var colors = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","DarkOrange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","RebeccaPurple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"]

function getTransform(el) {
  var matrix = $(el).css('transform');
  if (matrix == null) return [0,0,0];
  if (matrix.indexOf('matrix3d') == 0) return matrix.substring(9,matrix.length-1).split(',').slice(12,15);
  else if (matrix.indexOf('matrix') == 0) return matrix.substring(7,matrix.length-1).split(',').slice(4,6).concat("0");
  else return [0,0,0]
}

function setTransform(el, arr_xyz, animate) {
  if (animate) $(el).css('transition','transform 0.5s ease-in-out');
  var translation = arr_xyz.join('px,') + 'px';
  $(el).css('transform', 'translate3D(' + translation + ')');
  if (animate) setTimeout(function() {$(el).css('transition','')},500);
}

function setY(slider, percentage, animate) {
  var current = getTransform(slider);
  if (percentage >= slideLimit) percentage = slideLimit;
  if (percentage >= 1) percentage = 1;
  current[1] = Math.floor(- $(slider).height() * percentage);
  setTransform(slider, current, animate)
}

function setAllY(percentage) {
  for (var i = 0; i < $('.slide.desired').length; i++) {
    setY($('.slide.desired')[i], percentage, true);
  }
}

function setRotate(X, Y) {
  if (Y >= 760) Y -= 360;
  if (Y <= 40) Y += 360;
  if (X >= 685) X -= 360;
  if (X <= -35) X += 360;
  var newRotate = 'rotateX(' + X + 'deg) rotateY(' + Y + 'deg)';
  $('.scene')[0].style.transform = newRotate;
}

function resetAll() {
  //colors
  $('.slide').children().css('background-color','white');
  
  //position
  setAllY(0);

  //rotation
  $('.scene').css('transition','transform 0.5s ease-in-out');
  setRotate(325, 400);
  setTimeout(function() {$('.scene').css('transition','');},500);
}

function sliderDrag(e) {
  e.preventDefault();
  e.stopPropagation();

  var slider = $(e.target);
  $("body").css('cursor','-webkit-grabbing');
  $('.slide').css('cursor','-webkit-grabbing');

  var starterY = getTransform(slider)[1]/-slider.height();

  var Xi = (e.pageX);
  var Yi = (e.pageY);

  $("body").on('mousemove', function(e2){
    if (e2.which == 1) {
      var dragX = e2.pageX;
      var dragY = e2.pageY;
      var diffY = Yi - dragY;
      var newY = starterY + diffY/(slider.height()*2);
      if (newY < 0) newY = 0;
      if (newY > 1) newY = 1;
      grid.updateDesiredPos($(".slide.desired").index(slider), newY * 1000);
      setY(slider,newY,false);
    }
  });

  $("body").on('mouseup',function(e3){
    $("body").off('mousemove');
    $("body").off('mouseup');
    $("body").css('cursor','move');
    $('.slide').css('cursor','-webkit-grab');
  });
}

function sliderClick(e) {
  e.preventDefault();
  e.stopPropagation();
  var slider = $(e.target);

  // set color for both desired and actual slider 
  var sliderClasses = slider.parent().attr('class').split(' ');
  setColor($('.'+sliderClasses[sliderClasses.length - 1]), colors[Math.floor(Math.random() * colors.length)]);
}

function setColor(slider, color) {
  $(slider).each(function(slider_i) {
    $($(slider)[slider_i]).children().css('background-color',color);
  })
}

function freeRotate(e) {
  e.preventDefault();
  e.stopPropagation();

  var rotateVals = $('.scene')[0].style.transform.split(' ');

  var starterX = parseInt(rotateVals[0].substring(rotateVals[0].indexOf('(')+1, rotateVals[0].indexOf('deg)')));
  var starterY = parseInt(rotateVals[1].substring(rotateVals[1].indexOf('(')+1, rotateVals[1].indexOf('deg)')));

  var Xi = (e.pageX);
  var Yi = (e.pageY);

  $("body").on('mousemove', function(e2){
    if (e2.which == 1) {
      var dragX = e2.pageX;
      var dragY = e2.pageY;
      var diffX = Xi - dragX;
      var diffY = Yi - dragY;
      var newX = starterX + diffY*0.6;
      var newY = starterY - diffX*0.4;
      setRotate(newX, newY);
    }
  });

  $("body").on('mouseup',function(e3){
    $("body").off('mousemove');
    $("body").off('mouseup');
  });
}

function zoom (e) {
  e.preventDefault();
  e.stopPropagation();
  
  var scrollVal = e.wheelDelta;
  var currentZoom = parseFloat($('#model3D').css('zoom'));
  var newZoom = currentZoom + scrollVal/100;
  if (newZoom < 1) newZoom = 1;
  if (newZoom > 1.6) newZoom = 2;

  $('#model3D').css('zoom',newZoom);      
}

$(function() {
  $('.leftPane').on('mousewheel',function(e) {zoom(e.originalEvent)});
  $('.leftPane').on('dragstart',function(e) {freeRotate(e.originalEvent)});
  $('button').on('click',function() {resetAll()});
  $('.scene').on('dragstart','.slide',function(e) {sliderDrag(e.originalEvent)});
  $('.scene').on('click','.slide',function(e) {sliderClick(e.originalEvent)});
})

function makeCuboid (width, height, depth, x, y, z, draggable, customClass) {
  var shape = $('<div>', {
    'class':'shape cuboid ' + customClass,
    'draggable': draggable
  });
  shape.css('transform', 'translate3D(' + [-x,y,z].join('em,') + 'em)');
  shape.css('width', width  + 'em');
  shape.css('height', height + 'em');
  shape.css('margin', -height/2 + 'em 0 0 ' + -width/2 + 'em');

  var ft = $('<div>', {'class':'face ft'});
  ft.css('transform','translateZ(' + depth/2 + 'em)');

  var bk = $('<div>', {'class':'face bk'});
  bk.css('transform','translateZ(' + (0 - depth/2) + 'em) rotateY(180deg)');

  var tp = $('<div>', {'class':'face tp'});
  var bm = $('<div>', {'class':'face bm'});
  tp.css('height', depth + 'em');
  bm.css('height', depth + 'em');

  var lt = $('<div>', {'class':'face lt'});
  var rt = $('<div>', {'class':'face rt'});
  lt.css('width', depth + 'em');
  rt.css('width', depth + 'em');

  shape.append(ft,bk,tp,bm,lt,rt);
  $('.scene').append(shape);
}

function makeCasing (height, side_x, side_z, thickness) {
  //two small ones
  makeCuboid(thickness, height, side_x,  side_z/2 + thickness/2, 0,  0,false,'casing');
  makeCuboid(thickness, height, side_x, -(side_z/2 + thickness/2), 0,  0,false,'casing');
  //two big ones
  makeCuboid(side_z + 2* thickness, height, thickness,  0, 0, side_x/2 + thickness/2,false,'casing');
  makeCuboid(side_z + 2* thickness, height, thickness,  0, 0, -(side_x/2 + thickness/2),false,'casing');
  //bottom
  makeCuboid(side_z + 2*thickness, thickness, side_x + 2*thickness, 0, height/2 + thickness/2, 0, false, 'casing');
}

function makePixel (height, sideLength, x, z, x_tot, z_tot) {
  makeCuboid(sideLength, height, sideLength, 
             z*sideLength - sideLength*(z_tot-1)/2, 0, x*sideLength - sideLength*(x_tot-1)/2,
             false, 'slide ' + x + '_' + z);

  // only desired one is draggable
  makeCuboid(sideLength, height, sideLength, 
             z*sideLength - sideLength*(z_tot-1)/2, 0, x*sideLength - sideLength*(x_tot-1)/2,
             true, 'slide desired ' + x + '_' + z);
}

function makeGrid (x_pixels, z_pixels, height, sideLength) {
  for (x = 0; x < x_pixels; x++) {
    for (z = 0; z < z_pixels; z++) {
      makePixel(height, sideLength, x, z, x_pixels, z_pixels);
    }
  }
}

function makeHaptic (x_pixels, z_pixels, height, sideLength, thickness, slideRange) {
  clearCanvas();
  makeGrid(x_pixels, z_pixels, height, sideLength);
  makeCasing(height, x_pixels*sideLength, z_pixels*sideLength, thickness);
  slideLimit = slideRange || 1;
}

function makeHapticTest() {
  makeHaptic(2, 2, 5, 5, 1, 1);
}

function clearCanvas () {
  $('.scene').html('');
}

//functions to be used by slider
function setDesiredPos (x,z,percentage,animate) {
  var id_class = x + '_' + z;
  var desired_slider = $('.' + id_class)[1];
  setY(desired_slider, percentage, animate);
}

function setPos (x,z,percentage,animate) {
  var id_class = x + '_' + z;
  var true_slider = $('.' + id_class)[0];
  setY(true_slider, percentage, animate);
}

function setLEDColor (x,z,color) {
  var id_class = x + '_' + z;
  setColor($('.' + id_class),color);
}