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
    log(doc, target)
    target && (target.lines || (target.lines = [])).push(
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
    .attr({ x2: target.x, y2: target.y }))
  }

  function added(doc) {
    doc.edges.map(norm)
    .forEach(_.partial(build_routes, doc))
  }

  function changed(doc) {
    // norm(doc).lines.forEach(function (line) {
    //   log(line)
    // });
  }

  function clear() { this.attr('class', null).attr('stroke-width', 0).remove() }

  function removed(doc) {
    doc = norm(doc)

    doc.lines.forEach(function (d) {
      log(d)
      d.remove()
    })

    var exit = el.selectAll('.edge')
                .attr('stroke-width', 1)
                .transition().duration(2000).ease('cubic')

     // exit.filter(function (d){ return d.target === doc })
    // .attr('x2', pluckWith('source.x'))
    // .attr('y2', pluckWith('source.y'))
    // .call(clear)

    // exit.filter(function (d){ return d.source === doc })
    // .attr('x1', pluckWith('target.x'))
    // .attr('y1', pluckWith('target.y'))
    // .call(clear)

  }
}