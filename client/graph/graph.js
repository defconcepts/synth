graph = function () {
  var el = d3.select('.graph')

  window.shiftKey = null

  function self(fn) {
    return el.selectAll('circle')
  }

  Graph.find()
  .observe({ changed: emit_later('changed')
           , added: emit_later('added')
           , removed: emit_later('removed')
           })

  body.call(self, d3.select(document.body))
  brush.call(self, d3.select('.brush'))
  nodes.call(self, d3.select('.graph'))
  edges.call(self, d3.select('.graph'))
}
