graph = function () {
  var el = d3.select('.graph')

  window.shiftKey = null

  function self(fn) {
    return el.selectAll('circle')
  }

  as_events(self)

  Graph.find()
  .observe({ changed: self.later('changed')
           , added: self.later('added')
           , removed: self.later('removed')
           })

  body.call(self, d3.select(document.body))
  brush.call(self, d3.select('.brush'))
  nodes.call(self, d3.select('.graph'))
  edges.call(self, d3.select('.graph'))
}
