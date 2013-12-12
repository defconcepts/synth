this.nodes = function (el) {
  var self = this
    , listeners = [ mouseover
                  , mouseout
                  , contextmenu
                  , dblclick
                  , mousedown
                  , signal
                  ]

  var draggable =
    d3.behavior.drag()
    .origin(_.identity)
    .on('dragstart', dragstart)
    .on('drag', drag)
    .on('dragend', dragend)

  Graph.find()
  .observe({ changed: changed
           , added: added
           , removed: removed
           })

  return 'hello'

  function signal(currentTarget, index, message) {
    d3.selectAll('.edge')

    .filter(function (d) {
      return currentTarget._id === d.source._id &&
        message.origin !== d.target._id &&
        d.source._id !== Session.get('world')._id
    })

    .each(function (d) {
      var step = _.findWhere(worlds, { name: d.source.type }).step
      if (message.origin !== d.target._id)
        d.target.getNode().emit('signal', message)
      //process message here.
    })
  }

  function mousedown(d) {
    var m = d3.select(this)
    Session.set('selected', d)
    d3.event.metaKey ? m.each(menu) : m.classed('grabbing', true)
  }

  function added (doc) {
    el.append('circle').datum(doc)
    .attr({ cx: Math.random() * innerWidth + (innerWidth * .25)
          , cy: Math.random() * innerHeight + (innerHeight * .25)
          , fill: node_fill
          , r: 20
          , class: 'node'
          })
    .listen_for(listeners)
    .call(draggable)
    .call(update_position)
  }

  function changed (doc) {
    var node = self().filter(function (d) { return doc._id === d._id }), datum = node.datum()
    update_link(_.extend(datum, doc, {edges: datum.edges}))
    update_position(node)
  }

  function removed (doc) {
    self()
    .filter(function (d) { return d._id === doc._id })
    .datum({}).attr('class', '')
    .transition().duration(500)
    .attr('r', 0)
    .remove()
  }

  function withinBoundsX(doc, dx) {
    return doc.x + doc.radius + dx < innerWidth &&
      doc.x - doc.radius + dx > 0
  }

  function withinBoundsY(doc, dx) {
    return doc.y + doc.radius + dx < innerHeight - el.node().parentElement.offsetTop &&
      doc.y - doc.radius + dx > 10
  }

  //combine and add bounds later
  //make resolution indepedent

  function drag(d) {
    var dx = d3.event.dx, dy = d3.event.dy

    if (! d.selected) return

    d.dragX += dx
    d.dragY += dy

    self().filter(pluckWith('selected'))
    .attr('cx', function(d) { return d.x += (withinBoundsX(d, dx) && dx) })
    .attr('cy', function(d) { return d.y += (withinBoundsY(d, dy) && dy) })
    .each(el.on('changed'))

      update_link(d)
  }

  function update_link(source) {
    self().each(function (target) {
      var max = 350
        , distance = dist(source, target)
        , connected = source.connected(target)

      if (source._id === target._id) return

      if (connected === -1) {
        if (distance > max)
          target.edges.remove(source._id) +
          el.on('removed')(target, source)
      }

      if (connected === 0 && distance < max - 50) {
        source.edges.push(target._id)
        el.on('added')(source)
      }

      if (connected === 1 && distance > max) {
        source.edges.remove(target._id)
        el.on('removed')(source, target)
      }
    })
  }

  function dblclick(d) {
    d3.event.preventDefault()

    Session.set('world', d)

    worlds.construct(d.type)
  }

  function dragstart (d) {
    d.previouslySelected = d.selected
    d.dragX = d.dragY = 0

    if (! d3.event.sourceEvent.shiftKey)
      d3.selectAll('.node').classed('selected', function (d) { return d.selected = false})

    d3.select(this).classed('selected', d.selected = true)
  }

  function dragend(d) {
    d3.select(this).classed('grabbing', false)

    //toggle if hasnt moved
    if (! (d.dragX || d.dragY))
      d3.select(this).classed('selected', d.selected = (d.previouslySelected ^ d.selected))

    self().filter(pluckWith('selected')).invoke('save')
  }

  function contextmenu(d) {
    d3.event.preventDefault()
    d3.event.stopPropagation()
    Graph.remove({ _id: d._id })
  }

  function mouseout(d) {
    d3.transition(d3.select(this)).attr('fill', node_fill)
  }

  function mouseover(d) {
    d3.transition(d3.select(this)).attr('fill', d3.rgb(node_fill(d)).brighter())
  }

  function update_position() {
    self()
    .transition()
    .duration(250)
    .ease('cubic-in-out')
    .attr('cx', pluckWith('x'))
    .attr('cy', pluckWith('y'))
  }
}

function menu (node) {
  var arc = d3.svg.arc()
            .innerRadius(node.radius + 20)
            .outerRadius(node.radius + 45)
    , types = _.keys(node_types)
    , l = 360 .toRad() / types.length
    , data = _.map(types, function (name, i) {
               return { type: name
                      , startAngle: i * l
                      , endAngle: (i + 1) * l
                      , i: i
                      }
             })
    , self = d3.select(this)

  var a = d3.select('svg').selectAll('.arc').data(data, pluckWith('i'))

  a.enter()
  .append('path')
  .attr('class', 'arc')
  .attr('fill', node_fill)
  .attr('d', arc)
  .on('mouseover', function (d) {
    self.transition().attr('fill', node_fill(d))
  })
  .on('mouseout', function (d) {
    self.transition().attr('fill', node_fill(d))
  })
  .on('click', function (d) {
    node.save({type: d.type })
    self.attr('type', d.type)
    a.attr('fill-opacity', 1).transition().attr('fill-opacity', 0).remove()
  })

  a.attr('transform', translate(node.x, node.y))
}

function translate(x, y) {
  return 'translate(' + [x, y].toString() + ')'
}