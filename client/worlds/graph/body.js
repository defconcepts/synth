this.body = body

function body(el) {
  var self = this

  el
  .on('keydown', keydown)
  .on('contextmenu', contextmenu)


  function contextmenu() {
    d3.event.preventDefault()
    var m = d3.mouse(this)

    function filter(d) { return dist(d, m) < 250 }

    Graph.insert({ type: rand_type()
                 , edges: _.pluck(self().data().filter(filter), '_id')
                 , x: m[0]
                 , y: m[1]
                 , state: dummy()
                 })
  }

  function nudge (d) {
    var e = d3.event
      , i = (d3.event.metaKey ? 10 : 100)
      , $inc = { 39: [+i, 0]
               , 37: [-i, 0]
               , 40: [0, +i]
               , 38: [0, -i]
               }[e.keyCode]

    if (e.keyCode === 8)
      e.preventDefault() +
      Graph.remove({_id: d._id })

    $inc &&
      e.preventDefault() +
      Graph.update({ _id: d._id }, { $inc: toCoord($inc) })
  }

  function keydown() {
    el.selectAll('.selected').each(nudge)
  }

  function dummy() {
    return [{ r: 14
            , position: [ 150, 150 ]
            , velocity: [ 1, 8 ]
            }]
  }

}
