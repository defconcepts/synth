this.sequencer = function () {

  d3.timer(function (d) {
    d3.selectAll('.node').each(function (d) {
      var sim = window[d.type]
      sim && (sim.step(d.state, d) || [])
             .forEach(pow, d3.select(this))
    })
  })

  d3.selectAll('.node').each(function (d) {
    var sim = window[d.type]
    sim.bpm &&
      setInterval(function () {
        sim && (sim.step(d.state, d) || []).forEach(pow, d3.select(this))
      }, sim.bpm)
  })

}

function pow(x) { this.emit('pow', x) }