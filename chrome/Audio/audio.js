var audio = new Audio();
audio.src = 'opening.mp3';
audio.controls = true;
audio.loop = true;
audio.autoplay = true;

var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;

var grid = new Grid();
for (var i = 0; i < 9; i++) {
  grid.newButton(i, function(button) {
    //console.log(button.desiredPosition);
  });
}
var skips =[0, 0, 0, 0];

$(document).ready(function() {
  $('#audio_box').append(audio);
  context = new AudioContext(); // AudioContext object instance
  analyser = context.createAnalyser(); // AnalyserNode method
  canvas = document.getElementById('analyser_render');
  analyser.fftSize = 256;
  ctx = canvas.getContext('2d');
  // Re-route audio playback into the processing graph of the AudioContext
  source = context.createMediaElementSource(audio); 
  source.connect(analyser);
  analyser.connect(context.destination);
  frameLooper();
});

function frameLooper(){
  window.requestAnimationFrame(frameLooper);
  fbc_array = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(fbc_array);
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  ctx.fillStyle = '#00CCFF'; // Color of the bars
  bars = 9;
  var length = Math.round(fbc_array.length - fbc_array.length / 2)
  for (var i = 0; i < bars; i++) {
    var average = 0;
    var max = 0;
    for (var a = Math.round(length / bars) * i; a < (length/bars) * (i + 1); a++) {
      average += fbc_array[a];
      if (fbc_array[a] > max) max = fbc_array[a];
    }

    average /= fbc_array.length / bars;
    bar_x = i * 11;
    bar_width = 10;
    bar_height = -(average / 2);
    //console.log(i, Math.round((-bar_height*10)/100)*100);
    skips[i] += 1;
    if (i < 4) {
      var pos = Math.round((-bar_height*10)/10)*10;
      pos = (pos - 500) * 10
      if (pos > 1000) pos = 1000; 
      grid.updateDesiredPos(i, pos);
      skips[i] = 0;
    }
    //  fillRect( x, y, width, height ) // Explanation of the parameters below
    ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
  }

}