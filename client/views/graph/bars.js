this.bars = function (el) {
  Deps.autorun(function ( ){
    console.log(Session.get('selected'))
  })

  'attack decay sustain release gain'.split(' ').map(stub)

  function stub(d){
    return { value: 100, name: d }
  }

  function pull() {
    var x = d3.event.sourceEvent.clientX - 850
    var y = d3.event.sourceEvent.clientY
    bars.at(Math.floor(y / 25) - 2).attr('width', x)
    .each(function (d) { d.value = x / 3 })
  }

  var draggable = d3.behavior.drag().on('dragstart', pull).on('drag', pull)
  el.call(draggable)

  el.append('rect').attr('width', 100 * 3)
  .attr('fill', 'none')
  .attr('stroke', 'grey')
  .attr('y', 24)
  .attr('height', 125).on('click', function () {
    el.emit('dragstart', d3.event)

  })

  var bars = el.style('border', '1px solid black').style('background', 'red')
  .attr('transform', 'translate(850, 10)')
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