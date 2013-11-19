(function() {

var soundBuffer = null;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

function loadSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      console.log("request.onload buffer = " + buffer)
      soundBuffer = buffer;
    });
  }
  request.send();
}

this.playSound = playSound
function playSound() {
  var source = context.createBufferSource();
  console.log("source = " + source)
  source.buffer = soundBuffer;
  source.connect(context.destination);
  source.start(0);
}

self.loadSound = loadSound;

setTimeout(function() {
  loadSound("soundfiles/808ish-Kick-1.wav");
}, 100)

var startOffset = 0;
var startTime = 0;

setInterval(function() {

  // var eighthNoteTime = 1;
  // var snare;
  // var hihat;

  // for (var bar = 0; bar < 2; bar++) {
  //   console.log("startTime = " + startTime)
  //   var time = startTime + bar * 8 * eighthNoteTime;
  //   // Play the bass (kick) drum on beats 1, 5
  //   playSound(soundBuffer, time);
  //   playSound(soundBuffer, time + 4 * eighthNoteTime);

  //   // Play the snare drum on beats 3, 7
  //   playSound(snare, time + 2 * eighthNoteTime);
  //   playSound(snare, time + 6 * eighthNoteTime);

  //   // Play the hihat every eighth note.
  //   for (var i = 0; i < 8; ++i) {
  //     playSound(hihat, time + i * eighthNoteTime);
  //   }
  // }
}, 200)

})();

//


// function pause() {
//   source.stop();
//   // Measure how much time passed since the last pause.
//   startOffset += context.currentTime - startTime;
// }

// function play() {
//   startTime = context.currentTime;
//   var source = context.createBufferSource();
//   // Connect graph
//   source.buffer = this.buffer;
//   source.loop = true;
//   source.connect(context.destination);
//   // Start playback, but make sure we stay in bound of the buffer.
//   source.start(0, startOffset % buffer.duration);
// }




// // window.onload = init;
// window.context;
// var bufferLoader;

// function sound_init() {
//   var contextClass;
//   // from http://chimera.labs.oreilly.com/books/1234000001552/ch01.html#s01_2
//   contextClass = (window.AudioContext ||
//     window.webkitAudioContext ||
//     window.mozAudioContext ||
//     window.oAudioContext ||
//     window.msAudioContext);
//   if (contextClass) {
//     // Web Audio API is available.
//     window.AudioContext = contextClass;
//   } else {
//     console.log("Web Audio API is not available. Ask the user to use a supported browser.");
//   }

//   context = new AudioContext();

//   bufferLoader = new BufferLoader(
//     context,
//     [
//       'soundfiles/808ish-Kick-1.wav',
//       'soundfiles/HH_606_PEQ1.wav',
//     ],
//     finishedLoading
//     );
//   window.bloader = bufferLoader;

//   bufferLoader.load();
// }

// function finishedLoading(bufferList) {
//   console.log("finishedLoading called")
//   // Create two sources and play them both together.
//   window.source1 = context.createBufferSource();
//   window.source2 = context.createBufferSource();
//   source1.buffer = bufferList[0];
//   source2.buffer = bufferList[1];

//   source1.connect(context.destination);
//   source2.connect(context.destination);
//   source1.start(context.currentTime + 1);
//   source2.start(0);
// }

// this.sound_init = sound_init;
// playSound(kickBuffer);
