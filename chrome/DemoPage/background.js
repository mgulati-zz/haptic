chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('generator.html', {
    'bounds': {
      'width': 1400,
      'height': 840
    }
  });
});