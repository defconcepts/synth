var context = new webkitAudioContext()
  , myAudioContext
  , myAudioAnalyser
  , mySource
  , mySpectrum
  , node1Buffer
  , node2Buffer
  , node3Buffer
  , node4Buffer
  , node5Buffer
  , node6Buffer
  , node7Buffer
  , node1Source
  , node2Source
  , node3Source
  , node4Source
  , node5Source
  , node6Source
  , node7Source
  , node1SoundUrl = 'sounds/128-loop.wav'
  , node2SoundUrl = 'sounds/ambient-steel1.wav'
  , node3SoundUrl = 'sounds/ambient-steel2.wav'
  , node4SoundUrl = 'sounds/ambient-steel3.wav'
  , node5SoundUrl = 'sounds/FL_Sci-Fi_4GL_03.wav'
  , node6SoundUrl = 'sounds/FL_Sci-Fi_4GL_05.wav'
  , node7SoundUrl = 'sounds/FL_Sci-Fi_4GL_07.wav'

function on(buffer, nodeId) {
  // console.log('in on, nodeId = ' + nodeId);
  // var source = context.createBufferSource(); // creates a sound source
  // source.buffer = buffer;                    // tell the source which sound to play
  // source.connect(context.destination);       // connect the source to the context's destination (the speakers)
  // source.noteOn(0);                          // play the source now
  if (nodeId === 'node1') {
    node1Source = context.createBufferSource();
    node1Source.buffer = buffer;
    node1Source.loop = true;
    node1Source.connect(context.destination);
    node1Source.noteOn(0);
  }
  if (nodeId === 'node2') {
    node2Source = context.createBufferSource();
    node2Source.buffer = buffer;
    node2Source.connect(context.destination);
    node2Source.noteOn(0);
  }
  if (nodeId === 'node3') {
    node3Source = context.createBufferSource();
    node3Source.buffer = buffer;
    node3Source.connect(context.destination);
    node3Source.noteOn(0);
  }
  if (nodeId === 'node4') {
    node4Source = context.createBufferSource();
    node4Source.buffer = buffer;
    node4Source.connect(context.destination);
    node4Source.noteOn(0);
  }
  if (nodeId === 'node5') {
    node5Source = context.createBufferSource();
    node5Source.buffer = buffer;
    node5Source.connect(context.destination);
    node5Source.noteOn(0);
  }
  if (nodeId === 'node6') {
    node6Source = context.createBufferSource();
    node6Source.buffer = buffer;
    node6Source.connect(context.destination);
    node6Source.noteOn(0);
  }
  if (nodeId === 'node7') {
    node7Source = context.createBufferSource();
    node7Source.buffer = buffer;
    node7Source.connect(context.destination);
    node7Source.noteOn(0);
  }
}

function off(nodeId) {
  if (nodeId === 'node1') {
    node1Source.noteOff(0);
  }
  if (nodeId === 'node2') {
    node2Source.noteOff(0);
  }
  if (nodeId === 'node3') {
    node3Source.noteOff(0);
  }
  if (nodeId === 'node4') {
    node4Source.noteOff(0);
  }
  if (nodeId === 'node5') {
    node5Source.noteOff(0);
  }
  if (nodeId === 'node6') {
    node6Source.noteOff(0);
  }
  if (nodeId === 'node7') {
    node7Source.noteOff(0);
  }
}

function load(url, nodeId) {
  // console.log('url = ' + url);
  // console.log('in load, nodeId = ' + nodeId);
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
    if (nodeId === 'node1') {
    node1Buffer = buffer;
    on(node1Buffer, nodeId);
    } else if (nodeId === 'node2') {
    node2Buffer = buffer;
    on(node2Buffer, nodeId);
    } else if (nodeId === 'node3') {
    node3Buffer = buffer;
    on(node3Buffer, nodeId);
    } else if (nodeId === 'node4') {
    node4Buffer = buffer;
    on(node4Buffer, nodeId);
    } else if (nodeId === 'node5') {
    node5Buffer = buffer;
    on(node5Buffer, nodeId);
    } else if (nodeId === 'node6') {
    node6Buffer = buffer;
    on(node6Buffer, nodeId);
    } else if (nodeId === 'node7') {
    node7Buffer = buffer;
    on(node7Buffer, nodeId);
    }
    // console.log('node1Buffer = ' + node1Buffer);
    // console.log('node2Buffer = ' + node2Buffer);
    // console.log('node3Buffer = ' + node3Buffer);
    });  // removed ', onError'
  }
  request.send();
  console.log(request);
}

function setSoundUrl(nodeId) {
  // console.log('in setSoundUrl, nodeId = ' + nodeId);
  if (nodeId === 'node1') {
    load(node1SoundUrl, nodeId);
  } else if (nodeId === 'node2') {
    load(node2SoundUrl, nodeId);
  } else if (nodeId === 'node3') {
    load(node3SoundUrl, nodeId);
  } else if (nodeId === 'node4') {
    load(node4SoundUrl, nodeId);
  } else if (nodeId === 'node5') {
    load(node5SoundUrl, nodeId);
  } else if (nodeId === 'node6') {
    load(node6SoundUrl, nodeId);
  } else if (nodeId === 'node7') {
    load(node7SoundUrl, nodeId);
  }
}

function playSound(button) {
  return setSoundUrl('node6');
  var node = $('#' + button.id)
    if (node.attr('value') === 'off') {
        var sound = setSoundUrl(button.id);
        node.attr('value', 'on');
    }
    else {
        off(button.id);
        node.attr('value', 'off');
    }
}

// param control

function printVariable(textBox) {
  var textBox = document.querySelector('#highpass-textbox')
  // textBox. ?
  console.log(textBox);
}

function hiPassFreq(value, textBox) {
  myNodes.filter.frequency.value = value;
  printVariable(value, textBox);
}

function pan(value) {
  myNodes.panner.setPosition(value, 0, 0);
}

function volume(value) {
  myNodes.volume.gain.value = value;
}

window.setSoundUrl = setSoundUrl