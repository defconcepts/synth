edges = function (el) {
  var self = this

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
      .datum({ source: doc, target: target })
      .attr({ class: 'edge'
            , stroke: pluckWith('source.fill')
            , x1: doc.x
            , y1: doc.y
            , x2: target.x
            , y2: target.y
            })
      .transition().duration(500)
      .ease('circle')
      .attr({ x2: target.x, y2: target.y })
  }

  function added(doc) {
    doc.edges.map(norm)
    .forEach(_.partial(build_routes, doc))
  }

  function changed(doc) {
    el.selectAll('.edge')
    .filter(function (d){ return doc._id === d.target._id })
    .attr('x2', doc.x)
    .attr('y2', doc.y)

    el.selectAll('.edge')
    .filter(function (d){ return d.source === doc })
    .attr('x1', doc.x)
    .attr('y1', doc.y)
  }

  function clear() { this.attr('class', null).remove() }

  function removed(doc) {
    var exit = el.selectAll('.edge')
               .attr('stroke-width', 1)
               .transition().duration(2000).ease('cubic')

    exit.filter(function (d){ return d.target._id === doc._id })
    .attr('x1', pluckWith('target.x'))
    .attr('y1', pluckWith('target.y'))
    .call(clear)

    exit.filter(function (d){ return d.source === doc })
    .attr('x2', pluckWith('source.x'))
    .attr('y2', pluckWith('source.y'))
    .call(clear)
  }
}