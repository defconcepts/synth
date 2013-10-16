this.table = table
table.step = step

function table (el, _) {
  var w = 960
    , h = 500
    , z = ~~ (h / 16)
    , x = w / z
    , y = h / z
    , bpm = 50


  var data = d3.range(x * y).map(function (d){
               return { valueOf: d3.functor(d) }
             })
  var svg = el.append('svg').attr('width', w).attr('height', h)

  var rect = svg.selectAll('rect').data(data)
             .enter().append('rect')
             .attr('transform', translate)
             .attr('width', z)
             .attr('height', z)
             .attr('fill', 'steelblue')
             .attr('stroke', 'aliceblue')
             .on('click', clicked)

  console.log(x)

  var i = 0
  setInterval(function (d){
    i = (i + 1) % x
    d3.selectAll('rect').attr('fill', fill)
    d3.selectAll('rect:nth-child(48n + ' + i + ')').attr('fill', 'red')
  }, bpm)

  function translate (d) {
    return "translate(" + (d % x) * z + "," + Math.floor(d / x) * z + ")";
  }

}
function fill (d) {
  return d.selected ? 'pink' : 'steelblue'
}

function step() {}

function clicked(d) {
  d.selected = ! d.selected
  d3.select(this).attr('fill', fill)
}