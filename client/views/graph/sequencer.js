sn.graph.sequencer = function () {
  var intervals = {}

  Graph.find().observe({
    added: added
  , removed: removed
  , changed: _.compose(added, removed)
  })

  setInterval(function () {
    //d3.selectAll('.edge').emit('pulse')
  }, 3000)

  //every bpm, run the simulation in each node on the screen
  //collect the results, if any, and send the source node the signal
  function added(doc) {
    var sim = sn.worlds[doc.type]
    if (!sim) debugger
    if (sim.class == 'source')
      intervals[doc._id] =
      setInterval(function () {
        (sim.step(doc.state, doc) || [])
        .map(function (message) { return { message: message, origin: doc._id } })
        .forEach(send_signal, doc.getNode())
      }, sim.bpm)
  }

  function removed(doc) {
    clearInterval(intervals[doc._id])
    return doc
  }
}

function send_signal(message) { this.emit('signal', message) }