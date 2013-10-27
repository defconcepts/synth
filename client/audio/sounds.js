// (function() {

this.sound_init = sound_init;

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        // export the buffer list to window - trying for buffer persistence
        window.bufferList = loader.bufferList;
        if (++loader.loadCount == loader.urlList.length) loader.onload(loader.bufferList);
      },
      function(error) {
        // console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  console.log("in BufferLoader.load")
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}

// window.onload = sound_init;
window.context;
var bufferLoader;

function sound_init() {
  console.log("sound_init called")
  var contextClass;
  // from http://chimera.labs.oreilly.com/books/1234000001552/ch01.html#s01_2
  contextClass = (window.AudioContext || 
    window.webkitAudioContext || 
    window.mozAudioContext || 
    window.oAudioContext || 
    window.msAudioContext);
  if (contextClass) {
    // Web Audio API is available.
    window.AudioContext = contextClass;
  } else {
    console.log("Web Audio API is not available. Ask the user to use a supported browser.");
  }

  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      '../sounds/808ish-Kick-1.wav',
      '../sounds/HH_606_PEQ1.wav',
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList) {
  console.log("finishedLoading called")
  // Create two sources and play them both together.
  window.source1 = context.createBufferSource();
  window.source2 = context.createBufferSource();
  source1.buffer = bufferList[0];
  source2.buffer = bufferList[1];

  source1.connect(context.destination);
  source2.connect(context.destination);
  source1.start(context.currentTime + 1);
  source2.start(0);
}

$('.play').click(function() {
  playSound(kickBuffer);
})

// })();

