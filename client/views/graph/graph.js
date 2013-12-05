this.graph = function () {
  var el = d3.select('.graph')

  function self() {
    return el.selectAll('.node, .output')
  }


  body.call(self, d3.select('body'))
  nodes.call(self, d3.select('.graph'))
  output.call(self, d3.select('.graph'))
  edges.call(self, d3.select('.graph'))
  //brush.call(self, d3.select('.brush'))
  bars.call(self, d3.select('.bars'))
  gradients.call(self, d3.select('.graph'))
  sequencer.call(self, d3.select('.graph'))
  // sound_init();
}
