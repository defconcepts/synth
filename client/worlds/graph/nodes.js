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
      return doc._id === d.target._id ||
        doc._id === d.source._id
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

  function changed (doc) {
    self().filter(function (d) { return doc._id === d._id })
    .each(function (d) {
      var e = d.edges
      _.extend(d, doc)
      var f = _.extend({}, d, { edges: e })
      update_link(f)
    })
      update_position()
  }

  function removed (doc) {
    self()
    .filter(function (d) { return d._id === doc._id })
    .datum({}).attr('class', '')
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
    .call(update_position)
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
      var distance = dist(source, target)
      var connected = source.connected(target)

      if (source._id === target._id) return

      if (connected === -1) {
        if (distance < max) return log('ret')
        target.edges.remove(source._id)
        el.on('removed')(target, source)
        source.ondragend = function () {
          // self().filter(find(target._id)).invoke('save')
        }
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

    worlds.construct()

    d3.select(window).once('keydown', keydown)

    function keydown() {
      return d3.event.which === 27 ?
        worlds.destruct() :
        d3.select(this).once('keydown', keydown)
    }
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
    d3.transition(d3.select(this)).attr('fill', pluckWith('fill'))
  }

  function mouseover(d) {
    d3.transition(d3.select(this)).attr('fill', d3.rgb(d.fill).brighter())
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
            .innerRadius(node.radius + 10)
            .outerRadius(node.radius + 25)
    , l = 360..toRad() / COLORS.length
    , data = COLORS.map(function (d, i) {
               return {
                 fill: d
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
  .attr('fill', pluckWith('fill'))
  .attr('d', arc)
  .on('mouseover', function (d) {
    self.transition().attr('fill', d.fill)
  })
  .on('mouseout', function (d) {
    self.transition().attr('fill', pluckWith('fill'))
  })
  .on('click', function (d) {
    node.save({ fill: d.fill })
    self.attr('fill', d.fill)
    a.remove()
  })

  a.attr('transform', translate(node.x, node.y))
}

function translate(x, y) {
  return 'translate(' + [x, y].toString() + ')'
}