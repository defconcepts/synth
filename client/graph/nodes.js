nodes = function (el) {
  var self = this,
      listeners = [ mouseover
                  , mouseout
                  , contextmenu
                  , dblclick
                  , mousedown
                  , mouseup
                  ]
  self
  .on('added', added)
  .on('changed', changed)
  .on('removed', removed)

  function changed (doc) {
    self().each(function (d) { doc && doc._id === d._id && _.extend(d, doc) })
    update()
  }

  function removed (doc) {
    self()
    .filter(function (d) { return d._id === doc._id })
    .transition().duration(500)
    .attr('r', 0)
    .remove()
  }

  function added (doc) {
    self.emit('add', doc)

    el.append('circle').datum(doc)
    .attr({ cx: Math.random() * innerWidth + (innerWidth * .25)
          , cy: Math.random() * innerHeight + (innerHeight * .25)
          , fill: pluckWith('fill')
          , r: 25
          , class: 'node'
          })
    .listen_for(listeners)
    .call(draggable)

    update()
  }

  var draggable = d3.behavior.drag()
                  .origin(Object)
                  .on('drag', drag)
                  .on('dragend', dragend)

  function drag(d) {
    var dx = d3.event.dx, dy = d3.event.dy;

    self().filter(pluckWith('selected'))
    .attr('cx', function(d) { return d.x += dx })
    .attr('cy', function(d) { return d.y += dy })

    self.emit('nudge')
  }

  function dragend(d) {
    Graph.update({ _id: d._id }, { $set: { x: d.x, y: d.y } })
  }

  function dblclick(d) {
    d3.event.preventDefault()
    
    zoom_in(el, d).each('end', worlds.construct)
    return d3.select(window).once('keydown', keydown)

    function keydown() {
      return d3.event.which === 27 ?
        zoom_out(el, d).each('start', worlds.destruct) :
        this.once('keydown', keydown)
    }
  }

  function mousedown(d) {
    d.selected && shiftKey ?
      d3.select(this).classed('selected', d.selected = true) :
      self().classed('selected', function(p) { return p.selected = d === p })
  }

  function mouseup(d) {
    d.selected && shiftKey &&
      d3.select(this).classed('selected', d.selected = false)
  }

  function contextmenu(d) {
    d3.event.preventDefault()
    d3.event.stopPropagation()
    Graph.remove({ _id: d._id })
  }

  function mouseout(d) {
    d3.select(this).transition().attr('fill', pluckWith('fill'))
  }

  function mouseover(d) {
    d3.select(this).transition().attr('fill', d3.rgb(d.fill).brighter())
  }

  function update() {
    self()
    .transition()
    .duration(500)
    .ease('elastic')
    .attr('cx', pluckWith('x'))
    .attr('cy', pluckWith('y'))
    .each('start', self.later('nudge'))
  }

}
