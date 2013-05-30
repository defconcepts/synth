edges = function (el) {
  var self = this

  self
  .on('add', add)
  .on('nudge', nudge)
  .on('removed', removed)
  .call()
  .data()
  .forEach(add)

  function norm(id) {
    var node = self().filter(function (d) { return d._id === id })
    return ! node.empty() && node.datum()
  }

  function add(doc) {
    doc.edges.forEach(function (target) {
      if (! (target = norm(target))) return;
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
    .transition().duration(500).ease('elastic')
    .attr({ x1: pluckWith('source.x')
          , y1: pluckWith('source.y')
          , x2: pluckWith('target.x')
          , y2: pluckWith('target.y')
          })
  }

  function removed(doc) {
    function swap(d) {
      var swap = d.target
      d.target = d.source
      return d.source = swap
    }

    function filter(d){
      return d.target === doc || d.source === doc && swap(d)
    }

    el.selectAll('line').filter(filter)
    .attr('stroke-width', 1)
    .transition().duration(2000)
    .attr('x2', pluckWith('source.x'))
    .attr('y2', pluckWith('source.y'))
    .attr('stroke-width', 0)
    .remove()
  }

}