graph = function () {
  var el = d3.select('.graph')

  function self(fn) {
    return el.selectAll('.node')
  }

  body.call(self, d3.select(document.body))
  brush.call(self, d3.select('.brush'))
  nodes.call(self, d3.select('.graph'))
  edges.call(self, d3.select('.graph'))
  output.call(self, d3.select('.graph'))
  gradients.call(self, d3.select('svg'))
}
