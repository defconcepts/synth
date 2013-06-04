bounce = function bounce(el) {
  var gravity = [0, 9.81]
    , bounds = { x: [0, innerWidth], y: [0, innerHeight - 60] }
    , xscale = d3.scale.quantize()
              .domain([0, innerWidth])
              .range('abcdef'.split(''))

    , axis = d3.svg.axis().scale(xscale)

	d3.timer(function () {
    var inflate = el.select('.inflate')
    inflate.empty() || inflate.attr('r', function (d) { return d.r += 2 })
    el.selectAll('.ball').each(step)
  })

  el.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(25, " + (innerHeight - 50) + ")")
  //.call(xaxis)

  d3.select(document)
  .on('mousedown', mousedown)
  .on('mouseup', mouseup)

  function mouseup(){
    el.select('.inflate')
    .attr('class', 'ball')
    .transition().duration(500)
    .attr('fill', "hsl(" + Math.random() * 360 + ", 100%, 50%)")
  }

  function mousedown() {
	  spawn_ball([ d3.event.pageX, d3.event.pageY ],
               [ Math.random() * 15 * (Math.random() > .5 ? 1 : -1)
               , Math.random() * 15 * (Math.random() > .5 ? 1 : -1)
               ])
  }

  function spawn_ball(point, velocity) {
    var node = el.append('circle')
    .datum({ position: point, velocity: velocity, r: 5 })
    .attr('class', 'inflate')
    .attr('r', pluckWith('r'))
    .attr('transform', translate)

    node.datum()['node'] = node
  }

  function step(d) {
	  d.velocity = merge(d.velocity, scale(gravity, .0000001))

    collide(d)

	  d3.select(this).attr('transform', translate)
  }

  function collide(d){

	  if (d.position[1] < bounds.y[0]) {
      d.node.attr('fill', "hsl(" + Math.random() * 360 + ",100%,50%)")

		  d.velocity[1] = - d.velocity[1]
		  d.position[1] = bounds.y[0]
	  }

    if (d.position[1] > bounds.y[1]) {
      play_sound(d.position[0])

		  d.velocity[1] = - d.velocity[1]
		  d.position[1] = bounds.y[1]
	  }

	  d.position[0] =
      d.position[0] < bounds.x[0] ? bounds.x[1] :
      d.position[0] > bounds.x[1] ? bounds.x[0] : d.position[0]
  }

  function play_sound(x) {
    setSoundUrl('node' + xscale.range().indexOf(xscale(x)))
  }

  function scale(vec, coef) { return [coef * vec[0], coef * vec[1]] }
  function sum(arr) { return arr.reduce(function (a, b) { return a + b }) }
  function merge () { return _.zip.apply(_, [].slice.call(arguments)).map(sum) }
  function translate(d) {
    return 'translate(' + (d.position = merge(d.position, d.velocity)).toString()  + ')'
  }
};
