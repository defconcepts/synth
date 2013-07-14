this.edges = function (el) {
  var self = this
    , thickness = d3.scale.linear()
                  .domain([1, innerWidth / 4])
                  .range([10, 0])

  el
  .on('nudge', changed)
  .on('add', added)
  .on('remove', removed)

  self().data().forEach(added)

  Graph.find()
  .observe({ changed: changed
           , added: added
           , removed: removed
           })

  var pulse = _.throttle(function () {
                d3.selectAll('line').each(function (d, i) {
                  var dx = d.target.x - d.source.x
                    , dy = d.target.y - d.source.y
                    , theta = Math.atan2(dy, dx)
                    , r = d.source.radius * 1.6
                  el.insert('circle', '.node').attr('class', 'pulse')
                  .datum(d)
                  .attr('cx', d.source.x)
                  .attr('cy', d.source.y)
                  .attr('r', 5)
                  .attr('fill', 'aliceblue')
                  .attr('stroke', 'steelblue')
                  .transition().duration(1000).ease('ease-out')
                  .delay(function () { return Math.random() * (i * 10) })
                  .attr('cx', d.target.x - r * Math.cos(theta))
                  .attr('cy', d.target.y - r * Math.sin(theta))
                  .each('end', function () { d.target.getNode().emit('pulse') })
                  .remove()
                })
              }, 1500)

  d3.timer(pulse)

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
    el.selectAll('.edge').filter(filter)
    .transition().duration(500).ease('cubic')
    .attr('x1', pluckWith('target.x'))
    .attr('y1', pluckWith('target.y'))
    .attr('class', '').remove()

    function filter (d) { return match(doc, d.target) || match(doc, d.source) }
  }

  function match (a, b) { return a._id === b._id }
}