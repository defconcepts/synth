this.body = body

function body(el) {
  var self = this

  el.on('keydown', keydown)
  .on('contextmenu', contextmenu)

  function contextmenu() {
    d3.event.preventDefault()

    var m = d3.mouse(this)

    function filter(d) { return dist(d, m) < 200 }

    Graph.insert({ fill: random_color()
                 , edges: _.pluck(self().data().filter(filter), '_id')
                 , x: m[0]
                 , y: m[1]
                 , state: dummy()
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

  function dummy() {
    return [{ "r": 14
            , "position": [ 150, 150 ]
            ,"velocity": [ 1, 8 ]
            }]
  }

}
