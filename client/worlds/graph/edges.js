this.edges = function (el) {
  exports(pulse)

  var self = this
    , thickness = d3.scale.linear()
                  .domain([1, innerWidth / 4])
                  .range([10, 0])

  el
  .on('nudge', changed)
  .on('add', added)
  .on('removed', removed)

  self().data().forEach(added)

  Graph.find()
  .observe({ changed: changed
           , added: added
           , removed: removed
           })

  d3.timer(function () {
    d3.selectAll('.node').each(function (d) {
      var k =d3.select(this)

      d.state &&
        d.state.map(step, d).filter(_.identity)
        .forEach(function (x) {
          k.emit('pow', x)
        })
    })
  })

  function pulse(d, i, x) {
    if (! d.target || window.freeze) return
    var dx = d.target.x - d.source.x
      , dy = d.target.y - d.source.y
      , theta = Math.atan2(dy, dx)
      , r = d.source.radius * (d.target.class == 'output' ? 1.6 : 1)

    el.insert('circle', 'circle').attr('class', 'pulse')
    .datum(d)
    .attr('cx', d.source.x)
    .attr('cy', d.source.y)
    .attr('r', 2)
    .attr('fill', 'aliceblue')
    .transition().duration(1000).ease('ease-out')
    .delay(function () { return i * 100 })
    .attr('cx', d.target.x - r * Math.cos(theta))
    .attr('cy', d.target.y - r * Math.sin(theta))
    .each('end', function () { d.target.getNode().emit('pulse', d.source, x) })
    .remove()
  }

  function norm(doc) {
    var node = self().filter(function (d) { return d._id === (doc._id || doc) })
    if (! node.empty()) return node.datum()
  }

  function build_routes(doc, target) {
    el.insert('line', '*')
    .datum({ source: doc, target: target })
    .attr({ class: 'edge'
          , x1: doc.x
          , y1: doc.y
          , x2: doc.x
          , y2: doc.y
          , opacity: .75
          , stroke: doc.fill
          , 'stroke-width': stroke_width
          })
    .listen_for([mouseover, mouseout, pulse])
    .transition().duration(500).ease('cubic-in-out')
    .attr({ x2: target.x, y2: target.y })
  }

  function added(doc) {
    doc.edges &&
      doc.edges.map(norm).filter(_.identity)
      .forEach(_.partial(build_routes, doc))
  }

  function stroke_width(d) {
    return thickness(dist(_.values(_.pick(d.source, 'x', 'y')),
                          _.values(_.pick(d.target, 'x', 'y'))))
  }

  function changed(doc) {
    el.selectAll('.edge')
    .each(fix)
    .attr('stroke-width', stroke_width)
    .attr('x1', pluckWith('source.x'))
    .attr('y1', pluckWith('source.y'))
    .attr('x2', pluckWith('target.x'))
    .attr('y2', pluckWith('target.y'))

    function fix(d) {
      match(d.source, doc) && _.extend(d.source, doc)
      match(d.target, doc) && _.extend(d.target, doc)
    }
  }

  function removed(doc, m) {
    var filter = m
               ? function (d) {
                   return (match(doc, d.target) && match(m, d.source)) ||
                     (match(doc, d.source) && match(m, d.target))
                 }
               : f(doc)

    el.selectAll('.edge').filter(filter)
    .transition().duration(500).ease('cubic')
    .attr('x1', pluckWith('target.x'))
    .attr('y1', pluckWith('target.y'))
    .attr('class', '').remove()
  }

  function get_friends (edge) {
    return function (node) {
      return match(edge.target, node) ||
        match(edge.source, node)
    }
  }


  function f(node) {
    return function (edge) {
      return match(edge.target, node) ||
        match(edge.source, node)
    }
  }

  //todo highlight entire chain
  function mouseover(edge) {
    self().filter(get_friends(edge)).emit('mouseover')
  }

  function mouseout(edge) {
    self().filter(get_friends(edge)).emit('mouseout')
  }

  function match (a, b) { return a._id === b._id }
}