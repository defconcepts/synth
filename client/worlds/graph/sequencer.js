this.sequencer = function () {
  var shit = {}

  Graph.find().observe({
    added: added
  , removed: removed
  , changed: _.compose(removed, added)
  })

  function added(doc) {
    var sim = window[doc.type]
    shit[doc._id]= setInterval(function () {
                     (sim.step(doc.state, doc) || []).forEach(pow, doc.getNode())
                   }, sim.bpm)
  }
  function removed(doc) {
    clearInterval(shit[doc._id])
  }
}

function pow(x) { this.emit('pow', x) }