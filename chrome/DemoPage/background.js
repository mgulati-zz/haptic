chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('DevPage/devPage.html', {
    'bounds': {
      "width" :   window.screen.availWidth,
      "height":   window.screen.availHeight
    }
  });
});