nodes = function (el) {
  var self = this
    , listeners = [ mouseover
                  , mouseout
                  , contextmenu
                  , dblclick
                  , mousedown
                  , mouseup
                  ]

  var draggable =
    d3.behavior.drag()
    .origin(Object)
    .on('dragstart', dragstart)
    .on('drag', drag)
    .on('dragend', dragend)

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
          , r: 20
          , class: 'node'
          })
    .listen_for(listeners)
    .call(draggable)
    .call(update)
  }

  function dragstart(d) {
    d3.select(this).classed('selected', d.selected = 1)
  }

  function drag(d) {
    var dx = d3.event.dx, dy = d3.event.dy

    self().filter(pluckWith('selected'))
    .attr('cx', function(d) { return d.x += dx })
    .attr('cy', function(d) { return d.y += dy })
    .each(el.on('nudge'))

    update_link(d)

  }

  function update_link(source) {
    //todo add queue for inflight links so they can rejoin
    self().data()
    .forEach(function (target) {
      var distance = dist([source.x, source.y], [target.x, target.y])
      if (source._id === target._id ) return

      if (! _.contains(source.edges, target._id)
        && distance < 250
        && ! _.contains(target.edges, source._id)) {
        source.edges.push(target._id)
        el.on('add')(source)
      }

      if (_.contains(source.edges, target._id) && distance > 250) {
        source.edges.remove(target._id)
        el.select('.edge')
        .filter(function (doc) { return source._id === doc.source._id })
        .size() && (el.on('remove')(source), log('remove'))
      }

    })
  }


  function dragend(d) {
    Graph.update({ _id: d._id }, { $set: { x: d.x, y: d.y } })
  }

  function dblclick(d) {
    d3.event.preventDefault()

    Session.set('world', d)
    zoom_in(el, d).each('end', worlds.construct)
    return d3.select(window).once('keydown', keydown)

    function keydown() {
      return d3.event.which === 27 ?
        zoom_out(el, d).each('start', worlds.destruct) :
        d3.select(this).once('keydown', keydown)
    }
  }

  function mousedown (d) {
    d3.select(this)
    .classed('selected', d.selected = d3.event.shiftKey ? ! d.selected : 1)
  }

  function mouseup(d){
    if (! d3.event.shiftKey) {
      self().filter(function (p) { return d._id !== p._id })
      .classed('selected', function(d) { return d.selected = false })
    }
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
