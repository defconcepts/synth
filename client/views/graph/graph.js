sn.graph.init = function () {
  var el = d3.select('.graph')

  function self() {
    return el.selectAll('.node, .output')
  }

  sn.graph.body.call(self, d3.select('body'))
  sn.graph.brush.call(self, d3.select('.brush'))
  sn.graph.nodes.call(self, d3.select('.graph'))
  sn.graph.output.call(self, d3.select('.graph'))
  sn.graph.edges.call(self, d3.select('.graph'))

  sn.graph.bars.call(self, d3.select('.bars'))
  sn.gradients.call(self, d3.select('.graph'))
  sn.graph.sequencer.call(self, d3.select('.graph'))
  // sound_init();
}
