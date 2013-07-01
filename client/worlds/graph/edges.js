edges = function (el) {
  var self = this

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
            , stroke: pluckWith('source.fill')
            , x1: doc.x
            , y1: doc.y
            , x2: doc.x
            , y2: doc.y
            })
      .transition().duration(200).ease('cubic-in-out')
      .attr({ x2: target.x, y2: target.y })
  }

  function added(doc) {
    doc.edges.map(norm)
    .forEach(_.partial(build_routes, doc))
  }


  var thickness = d3.scale.linear()
  .domain([0, innerWidth / 5])
  .range([10, 0]);

  function strokeWidth(d) {
    return ~~ thickness(dist(_.values(_.pick(d.source, 'x', 'y')),
                          _.values(_.pick(d.target, 'x', 'y'))))
  }


  function changed(doc) {
    el.selectAll('.edge')
    .attr('opacity', '.5')
    .filter(function (d) { return doc._id === d.target._id })
    .attr('stroke-width', strokeWidth)
    .attr('stroke-color', 'white')
    .attr('x2', doc.x)
    .attr('y2', doc.y)

    el.selectAll('.edge')
    .attr('opacity', '.5')
    .filter(function (d) { return d.source._id === doc._id })
    .attr('stroke-width', strokeWidth)
    .attr('x1', doc.x)
    .attr('y1', doc.y)
  }

  function removed(doc) {
    el.selectAll('.edge').filter(filter)
    .attr('stroke-width', 1)
    .transition().duration(500).ease('cubic')
    .attr('x1', pluckWith('target.x'))
    .attr('y1', pluckWith('target.y'))
    .attr('class', '').remove()

    function filter (d) { return d.target._id === doc._id || d.source === doc }
  }
}