edges = function (el) {
  var self = this

  vent
  .on('add', add)
  .on('nudge', nudge)
  .on('removed', removed)


  self()
  .data()
  .forEach(add)

  function norm(id) {
    var node = self().filter(function (d) { return d._id === id })
    return ! node.empty() && node.datum()
  }

  function add(doc) {
    doc.edges.forEach(function (target) {
      if (! (target = norm(target))) return
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
    })
  }

  function nudge() {
    el.selectAll('.edge')
    .attr({ x1: pluckWith('source.x')
          , y1: pluckWith('source.y')
          , x2: pluckWith('target.x')
          , y2: pluckWith('target.y')
          })
  }

  function clear() { this.attr('class', null).attr('stroke-width', 0).remove() }

  function removed(doc) {
    var exit = el.selectAll('.edge')
                .attr('stroke-width', 1)
                .transition().duration(2000).ease('cubic')

    exit.filter(function (d){ return d.target === doc })
    .attr('x2', pluckWith('source.x'))
    .attr('y2', pluckWith('source.y'))
    .call(clear)

    exit.filter(function (d){ return d.source === doc })
    .attr('x1', pluckWith('target.x'))
    .attr('y1', pluckWith('target.y'))
    .call(clear)

  }
}