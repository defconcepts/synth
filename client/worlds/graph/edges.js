this.edges = function (el) {
  var self = this
    , thickness = d3.scale.linear()
                  .domain([0, 350])
                  .range([15, 1])

  //add edge holder box

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
    }, 100)

  d3.timer(function () {
    d3.selectAll('.node').each(function (d) {
      d.state.map(step, d).filter(_.identity)
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
    .transition().duration(1000).ease('cubic')
    .attr('cx', ex2(d))
    .attr('cy', why2(d))
    .each('end', function () { d.target.getNode().emit('pulse', d.source, x) })
    .remove()
  }

  function norm(doc) {
    var node = self().filter(function (d) { return d._id === (doc._id || doc) })
    if (! node.empty()) return node.datum()
  }

  function join_existing_route(source, target) {
    return d3.selectAll('line').filter(function (d) {
             return match(d.target, target) && match(source, d.source)
           })
           .attr('class', 'edge')
           .call(draw_line)
           .size()
  }

  function draw_line(el) {
    el.attr({ x1: pluckWith('source.x')
            , y1: pluckWith('source.y')
            , x2: pluckWith('target.x')
            , y2: pluckWith('target.y')
            })
  }

  function build_route(doc, target) {
    if (join_existing_route(doc, target)) return
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
          }).listen_for([ mouseover, mouseout, pulse ])
    .transition().duration(500).ease('cubic-in-out')
    .attr({ x2: pluckWith('target.x'), y2: pluckWith('target.y') })
  }

  function added(doc) {
    doc.edges.map(norm).filter(_.identity)
    .forEach(_.partial(build_route, doc))
  }

  function stroke_width(d) {
    return d.stroke_width =
      Math.abs(thickness(dist(_.values(_.pick(d.source, 'x', 'y')),
                              _.values(_.pick(d.target, 'x', 'y')))))
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

  function removed(doc, from) {
    var filter = from
               ? function (d) {
                   return (match(doc, d.target) && match(from, d.source)) ||
                     (match(doc, d.source) && match(from, d.target))
                 }
               : match_edge(doc)

    el.selectAll('.edge').filter(filter)
    .transition().duration(500)//.ease('ease-out')
    .attr('x1', pluckWith('target.x'))
    .attr('y1', pluckWith('target.y'))
    .attr('class', '').remove()
  }

  function match_node(edge) {
    return function (node) {
      return match(edge.target, node) ||
        match(edge.source, node)
    }
  }

  function match_edge(node) {
    return function (edge) {
      return match(edge.target, node) ||
        match(edge.source, node)
    }
  }

  //todo highlight entire chain
  function mouseover(edge) {
    self().filter(match_node(edge)).emit('mouseover')
  }

  function mouseout(edge) {
    self().filter(match_node(edge)).emit('mouseout')
  }
}

function match (a, b) { return a._id === b._id }

function angle(source, target) {
  var dx = target.x - source.x
    , dy = target.y - source.y

  return Math.atan2(dy, dx)
}

function ex1(d) {
  return d.source.x - d.source.radius * Math.cos(angle(d.target, d.source))
}

function ex2(d) {
  return d.target.x - d.target.radius * Math.cos(angle(d.source, d.target))
}

function why1(d) {
  return d.source.y - d.source.radius * Math.sin(angle(d.target, d.source))
}

function why2(d) {
  return d.target.y - d.target.radius * Math.sin(angle(d.source, d.target))
}