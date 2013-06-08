graph = function () {
  var el = d3.select('.graph')

  window.shiftKey = null

  function self(fn) {
    return el.selectAll('circle')
  }

  Graph.find()
  .observe({ changed: vent.later('changed')
           , added: vent.later('added')
           , removed: vent.later('removed')
           })

  body.call(self, d3.select(document.body))
  brush.call(self, d3.select('.brush'))
  nodes.call(self, d3.select('.graph'))
  edges.call(self, d3.select('.graph'))
}
