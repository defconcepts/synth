output = function (el) {
  var self = this

  var x = innerWidth / 2
    , y  = innerHeight / 2

  var output = el.append('circle')
               .attr('r', 35)
               .attr('cx', x)
               .attr('cy', y)
               .attr('cy', y)
               .attr('fill', 'url(#ocean_fill)')
               .attr('class', 'output')

  el.append('circle')
  .attr('r', 35)
  .attr('cx', x)
  .attr('cy', y)
  .attr('fill', 'url(#globe_highlight)')

  el.append('circle')
  .attr('r', 35)
  .attr('cx', x)
  .attr('cy', y)
  .attr('fill', 'url(#globe_shading)')

  // setInterval(pulse, 500)

  function pulse () {
    el.insert('circle', '.output')
    .attr('cx', x)
    .attr('cy', y)
    .attr('r', 0)
    .attr('opacity', 1)
    .attr('fill', 'url(#globe_highlight)')

    .transition().duration(5000).ease('cubic')
    .attr('r', 100)
    .attr('opacity', 0)
    .remove()
  }

}