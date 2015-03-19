$(document).ready(function() {
  window.grid = new Grid();
  for (var i = 0; i < 4; i++) {
    grid.newButton(i, function(button) {
      $slider = $(".slide:eq(" + button.id +")");
      setY($slider, button.position / 1000);
    });
  }
});