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

  var orb = el.append('circle')
  .call(circle, datum)
  .attr('fill', function (d) { return d.fill = 'url(#globe_shading)'})
  .on('click', click)

  var volume = buildIcon(icons.speaker, el)
               .attr('class', 'volume')
               .datum(function (d) { return _.extend(Object.create(datum), d, { toggled: 1 }) })
               .on('click', click)

  orb.call(click)

  function click(selection) {
    volume.each(function (d, i) {
      d3.select(this).attr(d.toggle = ! d.toggle ? d.hover : d)
    })
  }

  Deps.autorun(function () {
    datum.x = Session.get('width') / 2
    datum.y = Session.get('height') / 2

    ;(el.on('changed') || _.identity)({})

    el.selectAll('.center')
    .attr('cx', pluckWith('x'))
    .attr('cy', pluckWith('y'))

    volume.attr('transform', 'translate(' + [datum.x - 15, datum.y - 15] + ')')
  })

  function dasharray() {
    return d3.range(3).map(function () { return 1 + (Math.random() * 20) })
  }

  function signal(d, i, message) {
    if (volume.datum().toggled) sound_test(x.message)

    el.insert('circle', '*')
    .call(circle, datum)
    .attr('r', 35)
    .classed('emanating', 1)
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
