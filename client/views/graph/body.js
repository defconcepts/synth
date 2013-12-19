sn.graph.body = function (el) {
  var self = this

  el
  .on('keydown', keydown)
  .on('contextmenu', dblclick)

  function dblclick() {
    d3.event.preventDefault()
    var m = d3.mouse(this)

    function filter(d) { return dist(d, m) < 350 }

    sn.Graph.insert(sn.newNode(m, _.pluck(self().data().filter(filter), '_id')))
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
      sn.Graph.remove({_id: d._id })

    $inc &&
      e.preventDefault() +
      sn.Graph.update({ _id: d._id }, { $inc: toCoord($inc) })
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
