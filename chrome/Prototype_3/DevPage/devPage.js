$(document).ready(function() {
  
  var colors = ["#800000","FF281E","#FF0000","#FF0A00","#FF8C00","#FFA500","#FFD700","FFE600","#FFFF00","#9400D3","#8B008B","#4B0082","#483D8B","#6A5ACD","#7B68EE","#7FFF00","#008000","#006400","#008B8B","#008080","#00CED1","#4682B4","#87CEEB","#87CEFA","#00BFFF","#1E90FF","#6495ED","#4169E1","#0000FF","#0000CD"]
  var x = 3;
  var z = 3;
  var connected = false;

  //debuggable gnerator and grid
  generator = new Generator();
  generator.makeHaptic(x,z,10,3.5,0.3,0.75, updateDesired, null, randomColor);
  generator.setZoom(1.5);

  grid = new Grid();
  for (var i = 0; i < 9; i++) {
    grid.newButton(i, function(button) {
      var coordinates = grid.indexLookup(button.id);
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
    });
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
    for (var x_i = 0; x_i < x; x_i++) {
      for (var z_i = 0; z_i < z; z_i++) {
        generator.setLEDColor(x_i,z_i,'#ffffff');
        grid.updateColor(grid.coordinateLookup(x_i,z_i),'#ffffff');
        generator.setDesiredPos(x_i,z_i,0,true);
        updateDesired(x_i,z_i,0);
      }
    }
    $('.scene').css('transition','transform 0.5s ease-in-out');
    generator.setRotate(325, 400);
    setTimeout(function() {$('.scene').css('transition','')},500);
  }

  function connectSerial(port) {
    grid.arduino.connect(port,{bitrate: 115200});
    var timeout = 0;
    while (grid.arduino.connectionId < 0 && timeout++ < 10000);
    $("#a_select option").removeAttr('selected');
    if (timeout < 10000) {
      $("#a_select option:contains('" + port + "')").attr('selected', true);
    }
  }

  $('#reset').on('click',function() {resetAll()});
  $('#a_connect').on('click', function() {connectSerial($('#a_select').val())});
  $('#a_reset').on('click', function() {
    grid.arduino.getPorts(function(ports) {
      $('#a_select').html('');
      ports.forEach(function (port) {
        $('#a_select').append($('<option>',{'text': port.path}))
      })
    })
  })
  $('#a_pid').on('click', function() {
    for (var i = 0; i < 9; i++) {
      grid.updatePIDPreset(i, parseInt($("#pid_select").val()));
    }
  });
  // $('.nav button').attr('disabled',true)
});

