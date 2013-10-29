this.sequencer = function () {
  var nodes = {}

  Graph.find().observe({
    added: added
  , removed: removed
  , changed: _.compose(removed, added)
  })

  function added(doc) {
    var sim = window[doc.type]
    if (sim.class == 'source')
      nodes[doc._id]= setInterval(function () {
                        (sim.step(doc.state, doc) || []).forEach(send_signal, doc.getNode())
                      }, sim.bpm)
  }
  function removed(doc) {
    clearInterval(nodes[doc._id])
  }
}

function send_signal(message) { this.emit('signal', message) }