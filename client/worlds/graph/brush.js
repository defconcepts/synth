this.brush = function (el) {
  var self = this
    , shifted = []

  // add rotation
  // dispatch a select event instead of actually selecting

  var brushable =
    d3.svg.brush()
    .on('brushstart', brushstart)
    .on('brush', brush)
    .on('brushend', brushend)

  Deps.autorun(function () {
    brushable
    .x(d3.scale.identity().domain([0, Session.get('width')]))
    .y(d3.scale.identity().domain([0, Session.get('height')]))
  })

  el.datum({ selected: false , previouslySelected: false })
  .call(brushable)


  function selected (d) {
    shifted.push(d._id)
    d3.select(this).classed('selected', d.selected =
                            d3.event.sourceEvent.shiftKey ? ! d.selected : true)
  }


  function brushstart(d) {
    d3.event.sourceEvent.shiftKey &&
      self().filter(function (d) { return d.selected })
      .each(function (d) { shifted.push(d._id) })  }


  function brush() {
    var extent = d3.event.target.extent()
    self().classed('selected', function (d) {
      return d.selected = _.contains(shifted, d._id) ^ d.within(extent)
    })

  }

  function brushend() {
    shifted = []
    d3.event.target.clear()
    d3.select(this).call(d3.event.target)
  }

  function isNotNode(e) {
    e = e && e.sourceEvent && e.event && e.event.sourceEvent || {}
    return e.target && e.target.classList.match(/node/)
  }

  function never_dragged(extent) {
    return extent[0].toString() === extent[1].toString()
  }

  function reverse_selected(extent) {
    return never_dragged(extent) &&
      d3.selectAll('.node').each(selected)
  }

}
