chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('DevPage/devPage.html', {
    'id': 'dev',
    'bounds': {
      "width" :   window.screen.availWidth,
      "height":   window.screen.availHeight
    }
  });
});