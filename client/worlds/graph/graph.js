this.graph = function () {
  var el = d3.select('.graph')

  function self(fn) {
    return el.selectAll('.node, .output')
  }

  body.call(self, d3.select('body'))
  brush.call(self, d3.select('.brush'))

  gradients.call(self, d3.select('.graph'))
  nodes.call(self, d3.select('.graph'))
  output.call(self, d3.select('.graph'))
  edges.call(self, d3.select('.graph'))
  sequencer.call(self, d3.select('.graph'))
}
