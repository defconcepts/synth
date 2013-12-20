sn.graph.body = function (el) {
  var self = this

  el
  .on('keydown', keydown)
  .on('contextmenu', dblclick)

  function dblclick() {
    d3.event.preventDefault()
    var m = d3.mouse(this)

    function filter(d) { return dist(d, m) < 350 }

    var type = rand_type()
    Graph.insert({ type: type
                 , edges: _.pluck(self().data().filter(filter), '_id')
                 , x: m[0]
                 , y: m[1]
                 , state: sn.worlds[type].schema
                 , belongsTo: Session.get('currentTrack')
                 })
  }

  function nudge (d) {
    var e = d3.event
      , i = e.metaKey ? 100 : 10
      , $inc = { 39: [+i, 0]
               , 37: [-i, 0]
               , 40: [0, +i]
               , 38: [0, -i]
               }[e.keyCode]

    if (e.which == 82) sn.redo()

    if (e.which == 90) sn.undo()

    if (e.keyCode === 8)
      e.preventDefault() +
      Graph.remove({_id: d._id })

    $inc &&
      e.preventDefault() +
      Graph.update({ _id: d._id }, { $inc: toCoord($inc) })
  }

  function keydown() {
    if (this == document.body)
      self().filter('.selected').each(nudge)
  }
}


function dragndrop () {
  d3.select('body')
      .on("dragenter", dragmisc)
      .on("dragexit", dragmisc)
      .on("dragover", dragmisc)
      .on("drop", drop);
}

function dragmisc() {
  d3.event.stopPropagation();
  d3.event.preventDefault();
}

function drop() {
  var e = d3.event
    , fr = new FileReader()
    , files = e.dataTransfer.files
    , count = files.length

  fr.onloadend = loadend
}

function loadend () {
  var contents = this.result
}