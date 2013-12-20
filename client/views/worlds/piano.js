sn.worlds.piano = piano
piano.step = step
piano.schema = []

function piano () {}

function step (i) {
  return [i]
}

//only source nodes need step
//the stepping of an audio node is the reception of a midi event