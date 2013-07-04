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

  function norm(doc) {
    var node = self().filter(function (d) { return d._id === (doc._id || doc) })
    if (! node.empty()) return node.datum()
  }

  function build_routes(doc, target) {
    target &&
      el.insert('line', '.node')
      .on('remove', removed)
      .datum({ source: doc, target: target })
      .attr({ class: 'edge'
            , x1: doc.x
            , y1: doc.y
            , x2: doc.x
            , y2: doc.y
            , opacity: '.5'
            , stroke: pluckWith('source.fill')
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
    .filter(function (d) { return doc._id === d.target._id })
    .attr('stroke-width', stroke_width)
    .attr('x2', doc.x)
    .attr('y2', doc.y)
    .attr('x1', pluckWith('source.x'))
    .attr('y1', pluckWith('source.y'))

    el.selectAll('.edge')
    .filter(function (d) { return d.source._id === doc._id })
    .attr('stroke-width', stroke_width)
    .attr('x1', doc.x)
    .attr('y1', doc.y)
    .attr('x2', pluckWith('target.x'))
    .attr('y2', pluckWith('target.y'))
  }

  function removed(doc) {
    el.selectAll('.edge').filter(filter)
    .transition().duration(500).ease('cubic')
    .attr('x1', pluckWith('target.x'))
    .attr('y1', pluckWith('target.y'))
    .attr('class', '').remove()

    function filter (d) { return d.target._id === doc._id || d.source === doc }
  }
}