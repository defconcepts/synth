brush = function (el) {
  var self = this

  function brushstart(d) {
    self().each(function(d) {
      d.previouslySelected = d3.event.shiftKey && d.selected
    })
  }

  function brush(){
    var extent = d3.event.target.extent()
    self().classed('selected', function(d) {
      return d.selected = d.previouslySelected ^
        (extent[0][0] <= d.x &&
         d.x < extent[1][0] &&
         extent[0][1] <= d.y &&
         d.y < extent[1][1])
    })
  }

  function brushend() {
    d3.event.target.clear()
    d3.select(this).call(d3.event.target)
    //d3.event.stopPropagation()
  }

  el.datum({ selected: false , previouslySelected: false })
  .call(d3.svg.brush()
        .x(d3.scale.identity().domain([0, innerWidth]))
        .y(d3.scale.identity().domain([0, innerHeight]))
        .on('brushstart', brushstart)
        .on('brush', brush)
        .on('brushend', brushend))
}
