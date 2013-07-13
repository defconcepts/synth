edges = function (el) {
  var self = this
    , thickness = d3.scale.linear()
                  .domain([1, innerWidth / 4])
                  .range([10, 0])

  el.on('nudge', changed).on('add', added)

  self().data().forEach(added)

  Graph.find()
  .observe({ changed: changed
           , added: added
           , removed: removed
           })

  setInterval(function () {
    d3.selectAll('line').each(function (d) {
      el.insert('circle', '.node').attr('class', 'pulse')
      .attr('cx', d.source.x)
      .attr('cy', d.source.y)
      .attr('r', 5)
      .attr('fill', 'blue')
      .transition().duration(499)
      .attr('cx', d.target.x)
      .attr('cy', d.target.y)
      .remove()
    })
  }, 500)

  function norm(doc) {
    var node = self().filter(function (d) { return d._id === (doc._id || doc) })
    if (! node.empty()) return node.datum()
  }

  function build_routes(doc, target) {
    el.on('remove', removed)
    .insert('line', '.node')
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
    .transition().duration(500).ease('cubic-in-out')
    .attr({ x2: target.x, y2: target.y })
  }

  function added(doc) {
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

  function removed(doc) {
    log('hello')
    el.selectAll('.edge').filter(filter)
    .transition().duration(500).ease('cubic')
    .attr('x1', pluckWith('target.x'))
    .attr('y1', pluckWith('target.y'))
    .attr('class', '').remove()

    function filter (d) { return match(doc, d.target) || match(doc, d.source) }
  }

  function match (a, b) { return a._id === b._id }
}