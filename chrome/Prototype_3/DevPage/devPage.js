$(document).ready(function() {
  
  var colors = ["#800000","FF281E","#FF0000","#FF0A00","#FF8C00","#FFA500","#FFD700","FFE600","#FFFF00","#9400D3","#8B008B","#4B0082","#483D8B","#6A5ACD","#7B68EE","#7FFF00","#008000","#006400","#008B8B","#008080","#00CED1","#4682B4","#87CEEB","#87CEFA","#00BFFF","#1E90FF","#6495ED","#4169E1","#0000FF","#0000CD"]
  var x = 2;
  var z = 2;
  var connected = false;

  //debuggable gnerator and grid
  generator = new Generator();
  generator.makeHaptic(x,z,7,4,0.3,1, updateDesired, null, randomColor);
  generator.setZoom(2.5);

  grid = new Grid();
  for (var i = 0; i < 9; i++) {
    grid.newButton(i, function(button) {
      var coordinates = grid.indexLookup(button.id);
      if (coordinates[0] > 1 || coordinates[1] > 1) return; //for 2x2 grid right now
      generator.setPos(coordinates[0], coordinates[1], button.position / 1000, false);
      generator.setDesiredPos(coordinates[0], coordinates[1], button.desiredPosition / 1000, false);
      if (connected == false) {
        connected = true;
        $('.nav button').attr('disabled',false);
      }
    });
  }
  grid.arduino.getPorts(function(ports) {
    ports.forEach(function (port) {
      $('#a_select').append($('<option>',{'text': port.path}))
    })
  })

  function randomColor(x,z) {
    var color = colors[Math.floor(Math.random() * colors.length)];
    generator.setLEDColor(x,z,color);
    grid.updateColor(grid.coordinateLookup(x,z),color);
  }

  function updateDesired(x, z, newY) {
    grid.updateDesiredPos(grid.coordinateLookup(x,z), newY * 1000);
  }

  function resetAll() {
    //colors
    for (var x = 0; x < 2; x++) {
      for (var z = 0; z < 2; z++) {
        updateDesired(x,z,0);
        generator.setLEDColor(x,z,'#ffffff');
        grid.updateColor(grid.coordinateLookup(x,z),'#ffffff');
        generator.setDesiredPos(x,z,0,true);
      }
    }
    $('.scene').css('transition','transform 0.5s ease-in-out');
    generator.setRotate(325, 400);
    setTimeout(function() {$('.scene').css('transition','')},500);
  }

  $('#reset').on('click',function() {resetAll()});
  $('#a_connect').on('click', function() {grid.arduino.connect($('#a_select').val(),{bitrate: 115200})})
  $('#a_reset').on('click', function() {
    grid.arduino.getPorts(function(ports) {
      $('#a_select').html('');
      ports.forEach(function (port) {
        $('#a_select').append($('<option>',{'text': port.path}))
      })
    })
  })

  // $('.nav button').attr('disabled',true)
});

