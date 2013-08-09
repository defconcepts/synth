
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
                        }
                      )

  var output = el.append('circle')
               .call(circle, datum)
               .attr('fill', function (d) { return d.fill = 'url(#ocean_fill)'})
               .classed('output', true)
               .on('pulse', pulse)

  el.append('circle')
  .call(circle, datum)
  .attr('fill', function (d) { return d.fill = 'url(#globe_highlight)'})

  el.append('circle')
  .call(circle, datum)
  .attr('fill', function (d) { return d.fill = 'url(#globe_shading)'})
  .on('click', function () {
    volume.attr('width', function (d) { return d.radius * ((d.toggled = !d.toggled) ? 1 : .6) })
  })

  var volume = el.append('image')
          .attr('xlink:href', volume_icon)
          .attr('preserveAspectRatio', 'xMinYMin slice')
          .attr('class', 'volume').datum(_.extend(Object.create(datum), { toggled: 1 }))
          .attr('height', function (d) { return d.radius * .77 })
          .attr('width', function (d) { return d.radius })

  Deps.autorun(function () {
    datum.x = Session.get('width') / 2
    datum.y  = Session.get('height') / 2

    ;(el.on('changed') || _.identity)({})

    el.selectAll('.center')
    .attr('cx', pluckWith('x'))
    .attr('cy', pluckWith('y'))

    volume.attr({ x: datum.x - 15, y: datum.y - 15 })
  })

  function dasharray() {
    return d3.range(3).map(function () { return 1 + (Math.random() * 20) })
  }

  function pulse (_, _, d, x) {
    if (window.freeze || ! volume.datum().toggled) return

    sound_test(x)

    el.insert('circle', '*')
    .call(circle, datum)
    .attr('r', 35)
    .classed('emanating', 1)
    .attr('fill', 'none')
    .attr('stroke', node_fill(d))
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

function volume_icon () {
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAaCAMAAADlsH4wAAAABGdBTUEAALGPC/xhBQAAASZQTFRFaHV+aHV+aHV+ZnZ8aHV+aXN+Z3N8aXV+aHV9ZoCAaXV/Z3V+aHV+aHV/aHV+aHV+Y3GAanGAZmZmaHV+Z3V8aHR9aHZ+Z3R+Z3R9aXiAaHV+ZnV8YHCAamqAaHV+YICAZ3V+aHV+aHV+aXZ+aHV+aneAaXaAaHV+Z3R+aXV9aHV+aHZ+aHV9aHV8ZnOAaXV+ZnB6aHV+aHV+anWAZ3V/aHV+aHR8ZHaAaXR8aHZ+aHR+aXN+aHV+aHV+anJ7Z3J9aHZ+aHV+aHZ/ZHp6aHR+aXV+aHV/anZ8aHV+Z3V9aXZ+AAAAVYCAZnd9bW2AZHR8Z3R+VVVVgICAZ3Z9aHZ+aHZ+aHV+aHV+aHJ9Z3V+aHV+bW1taHV+aHV9Z3R+aHV+AAAAaHV+xhc15wAAAGF0Uk5T4tjqUKxfUlV2CoNt8IfE7RIkBe5IWFthciLXRhAMzQhv8evZkDo44WM/pM6/TCjeGYzpGK/SQBxE86JJrvIdL9DglRfFkp8px3y0AQYtDiF5AwRouJrk/THv/Af1eE/+AMY2NQMAAAElSURBVCjPdZNVcsNAEEQVZmZmZuY4YMcxM8u23v0vkVFiRWDtfKh7pFeaqp1ezVDVR6NlNM8H671RbhLK+CH1kuWegetMG1J7BMvfF4UpeJHPIDZi3N1IN+tGAu84EeP8DKbGnUjjARtJmY+dKow4kHoJG7nVT0z5guEBQ8NTv8gx+qnIRBN6/ZGUTMib5htCir+kxSyIDkJQgaxtwJxoD2gKxJwQEemCigrZgnmRPuhUIAkxS6JD0OGPJFdhs/Z3MN3+yHIF1kUnx6BfMShCNCYyI33YXkCu6kBWtuNmNhZh1LnGpxfcmzYupJ12haFcdCP7sqGoJ1Kvbw4kVhfi8sobzGTeRg4F13fb450t/CM5OfsD30uStkx87yjsf4/sSmRb5gfTNDi9XyWVFAAAAABJRU5ErkJggg=='
}