$(function() {
  var dataCounter = 0;

  var data = {
    labels: [],
    datasets: [
      {
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: []
      },
      {
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: []
      }
    ]
  };

  Chart.defaults.global.animation = false;
  Chart.defaults.global.showTooltips = false;

  var ctx = $("#pidChart").get(0).getContext("2d");
  posChart = new Chart(ctx).Line(data, {
    scaleOverride: true,
    scaleSteps: 10,
    scaleStepWidth: 100,
    scaleStartValue: 0,
    pointDot : false,
  });

  grid = new Grid();
  for (var i = 0; i < 9; i++) {
    grid.newButton(i, function(button) {
      if (button.id == 5) {
        if (dataCounter > 50) posChart.removeData();
        posChart.addData([button.position, button.desiredPosition],'');
        dataCounter++
      }
    });
  }
})
