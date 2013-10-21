this.nodes = function (el) {
  var self = this
    , listeners = [ mouseover
                  , mouseout
                  , contextmenu
                  , dblclick
                  , mousedown
                  , pow
                  ]

  function pow(doc, i,  x) {
    d3.selectAll('.edge').filter(function (d) {
      return doc._id === d.source._id &&
        d.source._id !== Session.get('world')._id
    }).emit('pulse', x)
  }

  function mousedown() {
    var m = d3.select(this)
    d3.event.metaKey ? m.each(menu) : m.classed('grabbing', true)
  }

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

  function find (id) {
    return function (doc) {
      return doc._id === id
    }
  }

  function added (doc) {
    console.log('added')
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
    console.log('changed')
    self().filter(function (d) { return doc._id === d._id })
    .each(function (d) {
      _.extend(d, doc)
      var f = _.extend({}, d, { edges: d.edges })
      update_link(f)
    })
      update_position()
  }

  function removed (doc) {
    console.log('removed')
    self()
    .filter(function (d) { return d._id === doc._id })
    .datum({}).attr('class', '')
    .transition().duration(500)
    .attr('r', 0)
    .remove()
  }

  function drag(d) {
    var dx = d3.event.dx, dy = d3.event.dy

    d.dragX += dx
    d.dragY += dy

    self().filter(pluckWith('selected'))
    .attr('cx', function(d) { return d.x += dx })
    .attr('cy', function(d) { return d.y += dy })
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
        if (distance < max) return log('ret')
        target.edges.remove(source._id)
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
    d.dragX = d.dragY = d.dragend = 0
    d3.select(this)
    .classed('selected', d.selected = ! (d3.event.sourceEvent.shiftKey && d.selected))
  }

  function dragend(d) {
    d3.select(this).classed('grabbing', false)

    if (! d3.event.sourceEvent.shiftKey && ! (d.dragX || d.dragY))
      self().filter(function (p) { return d._id !== p._id })
      .classed('selected', function(d) { return d.selected = false })
    d.dragend && d.dragend()
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