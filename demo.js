$(document).ready(function() {
  window.grid = new Grid();
  for (var i = 0; i < 4; i++) {
    grid.newButton(i, function(button) {
      $slider = $(".slide:eq(" + button.id +")");
      var coordinates = grid.coordinates[button.id];
      console.log(button.id)
      setPos(coordinates[0], coordinates[1], button.position / 1000, true);
    });
  }
});