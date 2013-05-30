bounce = function(svg) {
  var id = 0

  svg.append('circle')
  .datum(100)
  .attr({ class: 'hi'
        , r: 100
        , cy: 500
        , cx: 500
        , opacity: .7
        })


  function setSound() {
    return setSoundUrl('node' + ~~(Math.random() * 7));
  }

  function bounce() {
    svg.selectAll('.hi')
    .attr('cy', function(d, i) { return d })
    .transition()
    .duration(2000)
    .ease(mirror('cubic'))
    .attr('cy', innerHeight + (Math.random() * 100))
    .each('start', function() { setTimeout(setSound, 500) })
    .each('end', bounce)
  }

  bounce();
  svg.on('mouseup', function() {
    d3.select('.bounce').attr('class', 'hi')
    clearInterval(id)
  }).on('mousedown', function() {
    var r, s, x, y
    console.log('down');
    if (d3.event.button !== 0) return;
    x = d3.mouse(this)[0]
    y = d3.mouse(this)[1]
    s = svg.append('circle')
        .datum(y)
        .attr({ class: 'bounce'
              ,  opacity: .7
              , cx: x
              , cy: y
              });
    r = 1;
    id = setInterval(function() {
           s.attr({
             r: (r += 1) * 1.05
           });
         });
  });
};
