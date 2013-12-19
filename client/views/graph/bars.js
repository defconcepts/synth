sn.graph = {}
sn.graph.bars = function (el) {
  Deps.autorun(function ( ){
    console.log(Session.get('selected'))
  })

  'attack decay sustain release gain'.split(' ').map(stub)

  function stub(d){
    return { value: 100, name: d }
  }

  var row

  function pull() {
    var e = d3.event
    , x = e.sourceEvent.clientX - (innerWidth - 302)
    if (e.type == 'dragstart') row = Math.floor(e.sourceEvent.clientY / 25) - 1
    bars.at(row).attr('width', x).datum.value = x / 3
  }

  el.call(d3.behavior.drag().on('dragstart', pull).on('drag', pull))

  el.append('rect').attr('width', 100 * 3)
  .attr('fill', '#333')
  .attr('opacity', '.1')
  .attr('stroke', 'grey')
  .attr('y', 24)
  .attr('height', 125).on('click', function () {
    console.log(123)
    el.emit('dragstart', d3.event)
  })

  var bars = el.style('border', '1px solid black').style('background', 'red')
  .attr('transform', 'translate(' + [ innerWidth - 302, -15] +  ')')
  .selectAll('rect').data('attack decay sustain release gain'.split(' ').map(stub)).enter()
  .append('rect')
  .attr('fill', 'steelblue')
  .attr('class', 'bar')
  .attr('stroke', 'aliceblue')
  .attr('width', function (d) { return d.value * 3 })
  .attr('height', 25)
  .attr('x', 0)
  .attr('y', function (d, i) { return i * 25 })
  .each(function (d, i) {
    el.append('text').text(d.name)
    .attr('fill', 'white')
    .attr('x', 5)
    .attr('y', i * 25 + 20)
  })
}