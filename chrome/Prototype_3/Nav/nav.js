$(document).ready(function() {
  generateNavHTML();
  bindButtons();
});

function bindButtons() {
  $('.nav').on('click', 'button.3d', function() {changeDemo('DevPage/devPage.html','dev');});
  $('.nav').on('click', 'button.audio', function() {changeDemo('Visualizer/audio.html','audio');});
  $('.nav').on('click', 'button.form', function() {changeDemo('Form/form.html','form');});
}

function changeDemo(url, id) {
  chrome.app.window.create(url, {
    // 'id': id, cant reload window for now
    'bounds': {
      "width" :   window.screen.availWidth,
      "height":   window.screen.availHeight
    }
  }, function (createdWindow) {
    chrome.app.window.current().close();
  })
}

function generateNavHTML() {
  var nav = $('<div>', {'class': 'nav'});
  nav.append($('<button>', {'class': '3d', 'text': 'DEV'}));
  nav.append($('<button>', {'class': 'audio', 'text': 'AUDIO'}));
  nav.append($('<button>', {'class': 'form', 'text': 'FORM'}));
  $('body').append(nav);
}