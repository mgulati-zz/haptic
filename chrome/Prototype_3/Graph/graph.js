$(function() {
  var dataCounter = 0;

  var data = {
    labels: [],
    datasets: [
      {
        strokeColor: "rgba(0,250,50,1)",
        data: []
      },
      {
        strokeColor: "rgba(0,225,75,1)",
        data: []
      },
      {
        strokeColor: "rgba(0,200,100,1)",
        data: []
      },
      {
        strokeColor: "rgba(0,175,125,1)",
        data: []
      },
      {
        strokeColor: "rgba(0,150,150,1)",
        data: []
      },
      {
        strokeColor: "rgba(0,125,175,1)",
        data: []
      },
      {
        strokeColor: "rgba(0,100,200,1)",
        data: []
      },
      {
        strokeColor: "rgba(0,75,225,1)",
        data: []
      },
      {
        strokeColor: "rgba(0,50,250,1)",
        data: []
      },
      {
        strokeColor: "rgba(255,255,000,1)",
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
      }
    });
  }
})
