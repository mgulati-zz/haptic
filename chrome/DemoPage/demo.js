$(document).ready(function() {
  var colors = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","DarkOrange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","RebeccaPurple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"]

  var generator = new Generator();

  generator.makeHaptic(2,2,10,3,0.5,1, updateDesired, null,randomColor);

  function randomColor(x,y) {
    generator.setLEDColor(x,y, colors[Math.floor(Math.random() * colors.length)]);
  }

  function updateDesired(x, z, newY) {
    grid.updateDesiredPos(grid.coordinateLookup(x,z), newY * 1000);
  }

  function resetAll() {
    //colors
    for (var x = 0; x < 3; x++) {
      for (var z = 0; z < 3; z++) {
        generator.setLEDColor(x,z,'white');
        generator.setDesiredPos(x,z,0,true);
        grid.updateDesiredPos(x,z,0);
      }
    }

    $('.scene').css('transition','transform 0.5s ease-in-out');
    generator.setRotate(325, 400);
    setTimeout(function() {$('.scene').css('transition','')},500);
  }

  $('button').on('click',function() {resetAll()});

  window.grid = new Grid();
  for (var i = 0; i < 4; i++) {
    grid.newButton(i, function(button) {
      $slider = $(".slide:eq(" + button.id +")");
      var coordinates = grid.coordinates[button.id];
      generator.setPos(coordinates[0], coordinates[1], button.position / 1000, true);
    });
  }

});

