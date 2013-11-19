this.sequencer = function () {
  var nodes = {}

  Graph.find().observe({
    added: added
  , removed: removed
  , changed: _.compose(added, removed)
  })

  setInterval(function () {
    d3.selectAll('.edge').emit('pulse')
  }, 3000)

  function added(doc) {
    var sim = window[doc.type]
    if (sim.class == 'source')
      nodes[doc._id] = setInterval(function () {
                         (sim.step(doc.state, doc) || [])
                         .map(function (message) { return { message: message, origin: doc._id } })
                         .forEach(send_signal, doc.getNode())
                       }, sim.bpm)
  }

  function removed(doc) {
    clearInterval(nodes[doc._id])
    return doc
  }
}

function send_signal(message) { this.emit('signal', message) }