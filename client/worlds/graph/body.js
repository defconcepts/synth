exports(body)

function body(el) {
  var self = this

  el.on('keydown', keydown)
  .on('contextmenu', contextmenu)
  .on('mouseup', mouseup)

  setTimeout(mouseup, 100)

  function mouseup () {
    var e = d3.event || {}
    el.selectAll('.node').each(function (d) {
      d3.select(this).classed('selected',
                              d.selected = e.shiftKey && ! d.selected)
    })
  }

  function contextmenu() {
    d3.event.preventDefault()

    var m = d3.mouse(this)
      , x = m[0]
      , y = m[1]

    function filter(d) { return dist([d.x, d.y], [x, y]) < 150 }

    Graph.insert({ fill: random_color()
                 , edges: _.pluck(Graph.find().fetch().filter(filter), '_id')
                 , x: x
                 , y: y
                 })
  }

  function nudge (d) {
    var i = 100, $inc =
      { 38: [0, -i]
      , 37: [-i, 0]
      , 40: [0, +i]
      , 39: [+i, 0]
      }[d3.event.keyCode]

    if (d3.event.keyCode === 8)
      d3.event.preventDefault(), Graph.remove({_id: d._id })

    $inc && Graph.update({ _id: d._id }, { $inc: toCoord($inc) })
  }

  function keydown() {
    el.selectAll('.selected').each(nudge)
  }

}