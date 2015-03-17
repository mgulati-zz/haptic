$(document).ready(function() {
  var grid = new Grid();
  for (var i = 0; i < 4, i++) {
    grid.newButton(i, function(button) {
    setY(button.id, button.position);
  });
});