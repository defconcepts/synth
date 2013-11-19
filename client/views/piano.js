this.piano = piano
piano.step = step

function piano () {}

function step (i) {
  return [i]
}

//only source nodes need step
//the stepping of an audio node is the reception of a midi event