output = function (el) {
  var self = this

  var datum = _.extend(Object.create(Node)
                      , { radius: 35
                        , class: 'center'
                        , _id: 'output'
                        , edges: []
                        , getNode: function ( ){
                            return output
                          }
                        }
                      )

  Deps.autorun(function () {
    datum.x = Session.get('width') / 2
    datum.y  = Session.get('height') / 2
    el.selectAll('.center')
    .attr('cx', pluckWith('x'))
    .attr('cy', pluckWith('y'))
  })

  var output = el.append('circle')
               .call(circle, datum)
               .attr('fill', 'url(#ocean_fill)')
               .classed('output', true)
               .on('pulse', pulse)

  el.append('circle')
  .call(circle, datum)
  .attr('fill', 'url(#globe_highlight)')

  el.append('circle')
  .call(circle, datum)
  .attr('fill', 'url(#globe_shading)')

  // setInterval(pulse, 500)

  function pulse () {
    el.insert('circle', '.pulse')
    .call(circle, datum)
    .attr('r', 35)
    .attr('opacity', 1)
    .attr('fill', 'url(#globe_shading)')
    .transition().duration(3000).ease('ease-out')
    .attr('opacity', 0)
    .attr('r', 100)
    .remove()
  }

}