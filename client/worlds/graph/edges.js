this.edges = function (el) {
  exports(pulse)

  var self = this
    , thickness = d3.scale.linear()
                  .domain([0, innerWidth / 3])
                  .range([15, 1])

  el
  .on('changed', changed)
  .on('added', added)
  .on('removed', removed)

  self().data().forEach(added)

  Graph.find()
  .observe({ changed: changed
           , added: added
           , removed: removed
           })

  var pow =
    _.throttle(function (x) {
      this.emit('pow', x)
    }, 10)

  d3.timer(function () {
    d3.selectAll('.node').each(function (d) {
      d.state.map(step, d)
      .filter(_.identity)
      .forEach(pow, d3.select(this))
    })
  })

  function pulse(d, i, x) {
    if (! d.target || window.freeze) return

    var r = d.source.radius * (d.target.class == 'output' ? 1.6 : 1)

    el.insert('circle', 'circle')
    .attr('class', 'pulse')
    .attr('r', (d.stroke_width / 2) + 2)
    .attr('cx', ex1(d))
    .attr('cy', why1(d))
    .attr('fill', 'aliceblue')
    .transition().duration(1000).ease('ease-out')
    .delay(i * 100)
    .attr('cx', ex2(d))
    .attr('cy', why2(d))
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
    .listen_for([ mouseover, mouseout, pulse ])
    .transition().duration(500).ease('cubic-in-out')
    .attr({ x2: target.x, y2: target.y })
  }

  function added(doc) {
    doc.edges.map(norm).filter(_.identity)
    .forEach(_.partial(build_routes, doc))
  }

  function stroke_width(d) {
    return d.stroke_width = +
      thickness(dist(_.values(_.pick(d.source, 'x', 'y')),
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
    .attr('x1', ex1)
    .attr('y1', why1)
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

}

function match (a, b) { return a._id === b._id }

function angle(source, target) {
  var dx = target.x - source.x
    , dy = target.y - source.y

  return Math.atan2(dy, dx)
}


function ex1(d) {
  return d.source.x + 20 * Math.cos(angle(d.target, d.source))
}

function ex2(d) {
  return d.target.x - 20 * Math.cos(angle(d.source, d.target))
}

function why1(d) {
  return d.source.y + 20 * Math.cos(angle(d.target, d.source))
}

function why2(d) {
  return d.target.y - 20 * Math.cos(angle(d.source, d.target))
}