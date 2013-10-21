(function() {
// Fix up prefixing
var kickBuffer = null;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

function loadSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
    	kickBuffer = buffer;
    }); 
  }
  request.send();
}

function playSound(buffer) {
  var source = context.createBufferSource(); // creates a sound source
  source.buffer = buffer;                    // tell the source which sound to play
  source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  source.start(0);                           // play the source now
}

loadSound("audio-files/808ish-Kick-1.wav")

$('.play').click(function() {
	playSound(kickBuffer);
})

})();