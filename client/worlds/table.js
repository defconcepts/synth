this.table = table
table.step = step
table.bpm =  100
function table (el, data) {
  var w = 1280
    , h = innerHeight * .9
    , rows = 16
    , size = ~~ (h / rows)
    , i  = 0
    , svg = el.append('svg').attr('width', w).attr('height', h)
    , done, int

  data =
    256 == data.length ? data :
    d3.range(256).map(function (d){
      return { i: d }
    })

  var valueOf = function () {
    return this.i
  }

  data.forEach(function (d) { d.valueOf = valueOf })

  var rect = svg.selectAll('rect').data(data)
             .enter().append('rect')
             .attr('transform', translate)
             .attr('width', size)
             .attr('height', size)
             .attr('fill', 'steelblue')
             .attr('stroke', 'aliceblue')
             .on('click', clicked)

  int = setInterval(voice, table.bpm, data)
  voice(data)

  return function () {
    clearInterval(int)
    Graph.update({ _id: Session.get('world')._id },
                 { $set: { state: data
                         , index: i
                         }
                 })
  }

  function translate (d) {
    return "translate(" + [250 + (d % rows) * size,
                           Math.floor(d / rows) * size] + ")";
  }

  function voice(d) {
    i = (i + 1) % rows
    d3.selectAll('rect').attr('fill', fill)
    d3.selectAll('rect:nth-child(16n + ' + ~~ i + ')').attr('fill', fillVoice)
  }
}

//request animation frame is called once every ~16 ms
//so we store the last time of update in a map keyed by _id of node
//todo master sequencer which is independent of rendering loop
var _stepCooldown = {}

function step(data, item) {
  if (data.length < 256 ||
      new Date() - _stepCooldown[item._id] < table.bpm) return

  _stepCooldown[item._id] = + new Date()

  var i = (++item.index) % 16
  return data.filter(function (d) { return d.i % 16 == i && d.selected })
}

function fillVoice(d) {
  return d.selected ? 'pink' : 'red'
}

function fill (d) {
  return d.selected ? 'pink' : 'steelblue'
}

function clicked(d) {
  d.selected = ! d.selected
  d3.select(this).attr('fill', fill)
}