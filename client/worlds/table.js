this.table = table
table.step = step
table.bpm =  100
function table (el, data) {
  var w = 1280
    , h = innerHeight * .9
    , rows = 16
    , size = ~~ (h / rows)
    , svg = el.append('svg').attr('width', w).attr('height', h)
    , item = { _id: Session.get('world')._id, index: 0 }
    , done, int

  data =
    256 == data.length ? data :
    d3.range(rows * rows).map(d3.functor(false))

  var rect = svg.selectAll('rect').data(data)
             .enter().append('rect')
             .attr('class', 'table')
             .attr('transform', translate)
             .attr('width', size)
             .attr('height', size)
             .attr('fill', 'steelblue')
             .attr('stroke', 'aliceblue')
             .on('click', clicked)

  int = setInterval(voice, table.bpm, data)
  voice(data)

  Graph.find({ _id: Session.get('world')._id }).observe({
    changed: function (doc) {
      d3.selectAll('.table').data(doc.state).attr('fill')
    }
  })

  return function () {
    clearInterval(int)
    Graph.update({ _id: Session.get('world')._id },
                 { $set: { state: d3.selectAll('.table').data()
                         , index: item.index
                         }
                 })
  }

  function translate (d, i) {
    return "translate(" + [250 + (i % rows) * size,
                           Math.floor(i / rows) * size] + ")";
  }

  function voice(d) {
    d3.selectAll('.table').attr('fill', fill)
    step(data, item)
    d3.selectAll('.table:nth-child(16n + ' + ~~ item.index + ')').attr('fill', fillVoice)
  }
}

//request animation frame is called once every ~16 ms
//so we store the last time of update in a map keyed by _id of node
//todo master sequencer which is independent of rendering loop
var _stepCooldown = {}

function step(data, item) {
  // if (data.length < 256 ||
  //     new Date() - _stepCooldown[item._id] < (table.bpm / 2)) return
  _stepCooldown[item._id] = + new Date()
  var col = (item.index = (1 + item.index || 0) % 16)
  return data.filter(function (d, i) { return i % 16 == col && d })
}

function fillVoice(d) {
  return d ? 'pink' : 'red'
}

function fill (d) {
  return d ? 'pink' : 'steelblue'
}

function clicked(d) {
  d3.select(this).attr('fill', fill).datum(! d)
  Graph.update({ _id: Session.get('world')._id },
               { $set: { state: d3.selectAll('.table').data() }
               })
}