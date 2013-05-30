body = function (el) {
  var self = this

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

  function keydown() {
    shiftKey = d3.event.shiftKey || d3.event.metaKey

     var i = 100
      , $set = { 38: [0, -i]
               , 37: [-i, 0]
               , 40: [0, i]
               , 39: [i, 0]
               }[d3.event.keyCode]

    el.selectAll('.selected').each(function(d) {

      if (d3.event.keyCode === 8)
        d3.event.preventDefault(), Graph.remove({_id: d._id })

      if ($set) Graph.update({ _id: d._id }
                            , { $set: { x: d.x += $set[0], y: d.y += $set[1] } })
      })

  }

  function keyup() {
    shiftKey = d3.event.shiftKey || d3.event.metaKey
  }

  el.on('keydown', keydown)
  .on('keyup', keyup)
  .on('contextmenu', contextmenu)
}