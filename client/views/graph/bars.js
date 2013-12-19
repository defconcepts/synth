sn.graph = {}
sn.graph.bars = function (el) {

  var bars
  Deps.autorun(function () {
    var selected = Session.get('selected')
    if (selected) drawSelected(selected.params)
  })

  function stub(d) {
    return { value: 100, name: d }
  }

  var row

  function pull() {
    var e = d3.event
      , x = e.sourceEvent.clientX - (innerWidth - 302)
    if (e.type == 'dragstart') row = bars.at(Math.floor(e.sourceEvent.clientY / 25) - 1)
    if (! row.empty()) row.attr('width', x).datum()[1] = x / 3
  }

  function save () {
    if (row.empty()) return
    var datum = row.datum()
      , update = {}
    row = void 0
    update['params.' + datum[0]] = datum[1]
    sn.Graph.update({ _id: Session.get('selected')._id }, { $set: update })
    //if you select something else while dragging a parameter, it will fuck up
  }

  el.call(d3.behavior.drag().on('dragstart', pull).on('drag', pull).on('dragend', save))

  el.append('rect').attr('width', 100 * 3)
  .attr('fill', '#333')
  .attr('opacity', '.1')
  .attr('stroke', 'grey')
  .attr('y', 24)
  .attr('height', 125)

  function drawSelected(params) {
    bars = el.style('border', '1px solid black').style('background', 'red')
    .attr('transform', 'translate(' + [ innerWidth - 302, -15] +  ')')
    .selectAll('rect').data(_.pairs(params)).enter()
    .append('rect')
    .attr('fill', 'steelblue')
    .attr('class', 'bar')
    .attr('stroke', 'aliceblue')
    .attr('width', function (d) { return d[1] * 3 })
    .attr('height', 25)
    .attr('x', 0)
    .attr('y', function (d, i) { return i * 25 })
    .each(function (d, i) {
      el.append('text').text(d[0])
      .attr('fill', 'white')
      .attr('x', 5)
      .attr('y', i * 25 + 20)
    })
  }

}