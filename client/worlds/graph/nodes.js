nodes = function (el) {
  var self = this,
      listeners = [ mouseover
                  , mouseout
                  , contextmenu
                  , dblclick
                  , mousedown
                  , mouseup
                  ]

  Graph.find()
  .observe({ changed: changed
           , added: added
           , removed: removed
           })

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
    var dx = d3.event.dx, dy = d3.event.dy

    self().filter(pluckWith('selected'))
    .attr('cx', function(d) { return d.x += dx })
    .attr('cy', function(d) { return d.y += dy })

    console.log(123);
    add_link(d)
    el.on('nudge')(d)
  }

  function add_link(d) {
    var nodes = self().data()
    nodes.forEach(function (o) {
      var distance = dist([d.x, d.y], [o.x, o.y])
      if (o._id === d._id ) return
      if (! _.contains(d.edges, o._id) && distance < 250)
        d.edges.push(o._id), el.on('add')(d), log('add')

      if (_.contains(d.edges, o._id) && distance > 250) {
        d.edges.remove(o._id)
        var e = el.select('.edge')
                .filter(function (doc) { return d._id === doc.source._id })
        e.size() || log('why', d3.selectAll('.edge').size())
        e.size() && e.on('remove')(d)
        log('remove')
      }

      Graph.update({_id: d._id}, d)
    })
  }


  function dragend(d) {
    Graph.update({ _id: d._id }, { $set: { x: d.x, y: d.y } })
  }

  function dblclick(d) {
    d3.event.preventDefault()

    //move to worlds
    Session.set('world', d)
    zoom_in(el, d).each('end', worlds.construct)
    return d3.select(window).once('keydown', keydown)

    function keydown() {
      return d3.event.which === 27 ?
        zoom_out(el, d).each('start', worlds.destruct) :
        d3.select(this).once('keydown', keydown)
    }
  }

  function mousedown(d) {
    d3.select(this).classed('selected', d.selected = true)
  }

  function mouseup(d) {
    d.selected && d3.event.shiftKey ?
      d3.select(this).classed('selected', d.selected = true) :
      self().classed('selected', function(p) { return p.selected = d === p })
  }

  function contextmenu(d) {
    d3.event.preventDefault()
    d3.event.stopPropagation()
    Graph.remove({ _id: d._id })
  }

  function mouseout(d) {
    d3.transition(d3.select(this)).attr('fill', pluckWith('fill'))
  }

  function mouseover(d) {
    d3.transition(d3.select(this)).attr('fill', d3.rgb(d.fill).brighter())
  }

  function update() {
    self()
    .transition()
    .duration(250)
    .ease('cubic-in-out')
    .attr('cx', pluckWith('x'))
    .attr('cy', pluckWith('y'))
  }

}
