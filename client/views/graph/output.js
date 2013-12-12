this.output = function (el) {
  var self = this

  var filter = d3.select('.graph').append("defs")
               .append('filter')
               .attr('id', 'blur')
               .append('feGaussianBlur')
               .attr('stdDeviation', 2);

  var datum = _.extend(Object.create(Node)
                      , { radius: 35
                        , class: 'center'
                        , _id: 'output'
                        , edges: []
                        , getNode: function () {
                            return output
                          }
                        })

  var output = el.append('circle')
               .call(circle, datum)
               .attr('fill', function (d) { return d.fill = 'url(#ocean_fill)'})
               .classed('output', true)
               .on('signal', signal)

  el.append('circle')
  .call(circle, datum)
  .attr('fill', function (d) { return d.fill = 'url(#globe_highlight)'})

  el.append('circle')
  .call(circle, datum)
  .attr('fill', function (d) { return d.fill = 'url(#globe_shading)'})
  .on('click', function () { volume.emit('click') })

  var volume = buildIcon(icons.speaker, el)
               .attr('class', 'volume')
               .datum(function (d) { return _.extend(Object.create(datum), d, { toggled: 1 }) })
               .on('click', click)

  volume.emit('click')

  function click(d) {
    var transform = (d.toggled = ! d.toggled) ? 'matrix(1, 0, 0, 1, 0, 0)' : 'matrix(0, 0, 0, 0, 22, 32)'
    volume.selectAll('path').each(function (d, i) {
      d3.select(this).transition().duration(200).ease('cubic').attr('transform', transform)
    })
  }

  Deps.autorun(function () {
    datum.x = Session.get('width') / 2
    datum.y = Session.get('height') / 2

    ;(el.on('changed') || _.identity)({})

    el.selectAll('.center')
    .attr('cx', pluckWith('x'))
    .attr('cy', pluckWith('y'))

    volume.attr('transform', 'translate(' + [datum.x - 35, datum.y - 30] + ')')
  })

  function dasharray() {
    return d3.range(3).map(function () { return 1 + (Math.random() * 20) })
  }

  function signal(d, i, message) {
    if (volume.datum().toggled) playSound()
    console.log(message)
    el.insert('circle', '*')
    .call(circle, datum)
    .attr('r', 35)
    .classed('emanating', true)
    .attr('fill', 'none')
    .attr('stroke', '#333')
    .attr('stroke-width', 3)
    .attr('stroke-dasharray', dasharray)
    .transition().duration(3000).ease('ease-out')
    .attr('stroke-width', 0)
    .attr('r', 100)
    .remove()
  }
}

function makeCircleDash(radius) {
  var l = radius * 2 * Math.PI
  return function () {
    var i = d3.interpolateString('0,' + l, l + ',' + l);
    return function(t) { return i(t); };
  }
}
