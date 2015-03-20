$(document).ready(function() {
  bindButtons();
});

function bindButtons() {
  $("button.3d").click(function() {
    changeDemo('3D/generator.html');
  });

  $("button.audio").click(function() {
    changeDemo('Audio/audio.html');
  });
}
function changeDemo(url) {
  chrome.app.window.create(url, {
    'bounds': {
      'width': 1400,
      'height': 840
    }
  })
  chrome.app.window.current().close();
}

function generateNavHTML() {
  var nav = $('<div>', {'class': 'nav'});
  nav.append($('<button>', {'class': 'audio'}));
  nav.append($('<button>', {'class': '3d'}));
  return nav;
}