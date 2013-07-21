center = [innerWidth >> 1, innerHeight >> 1]

default_zoom = function () {
  return center.concat(innerHeight)
}

zoom_in = function (el, d) {
  return zoom(el, default_zoom(), [d.x, d.y, 5])
}

zoom_out = function (el, d) {
  return zoom(el, [d.x, d.y, 5], default_zoom())
}

function zoom(el, start, end) {
  var interpolate = d3.interpolateZoom(start, end)

  return el.attr('transform', transform(start))
  .transition()
  .duration(2000)
  .attrTween('transform', function() {
    return function(t) { return transform(interpolate(t)) }
  })

  function transform(p) {
    var k = innerHeight / p[2]
      , x = center[0] - p[0] * k
      , y = center[1] - p[1] * k

    return 'translate(' + x + ', ' + y + ') scale(' + k + ')'
  }
}
