$(function() {
  
  var dataCounter = 0;
  var colors = ["#800000","#FF0A00","#9400D3","#483D8B","#7FFF00","#008B8B","#4682B4","#00BFFF","#0000CD"];
  var connected = false;

  var data = {
    labels: [],
    datasets: [
      {
        strokeColor: colors[0],
        data: []
      },
      {
        strokeColor: colors[1],
        data: []
      },
      {
        strokeColor: colors[2],
        data: []
      },
      {
        strokeColor: colors[3],
        data: []
      },
      {
        strokeColor: colors[4],
        data: []
      },
      {
        strokeColor: colors[5],
        data: []
      },
      {
        strokeColor: colors[6],
        data: []
      },
      {
        strokeColor: colors[7],
        data: []
      },
      {
        strokeColor: colors[8],
        data: []
      },
      {
        strokeColor: "#FFFFFF",
        data: []
      }
    ]
  };

  var ctx = $("#pidChart").get(0).getContext("2d");
  posChart = new Chart(ctx).Line(data, {
    scaleOverride: true,
    scaleSteps: 10,
    scaleStepWidth: 100,
    scaleStartValue: 0,
    pointDot : false,
    datasetFill : false,
    animation: false,
    showTooltips: false
  });

  grid = new Grid();
  var newData = [0,0,0,0,0,0,0,0,0];
  for (var i = 0; i < 9; i++) {
    grid.newButton(i, function(button) {
      newData[button.id] = button.position;
      if (button.id == 8) {
        if (dataCounter > 50) posChart.removeData();
        posChart.addData(newData.concat(button.desiredPosition),'');
        dataCounter++;
        if (connected == false) {
          connected = true;
          initialize();
        }
      }
    })
  }

  function initialize() {
    for (color in colors) {
      grid.updateColor(color, colors[color]);
    }
  }
})
