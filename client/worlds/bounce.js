bounce = function bounce(el) {
  var gravity = [0, .5]
    , bounds = { x: [0, innerWidth], y: [0, innerHeight - 60] }
    , xscale = d3.scale.quantize()
               .domain([0, innerWidth])
               .range([0, 6])

    , axis = d3.svg.axis().scale(xscale).orient('bottom')

  el.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(25, " + (innerHeight - 50) + ")")
  //.call(axis)

	d3.timer(function () {
    var inflate = el.select('.inflate')
    inflate.empty() || inflate.attr('r', function (d) { return d.r += 2 })
    el.selectAll('.ball').each(step)
  })

  d3.select(document)
  .on('mousedown', mousedown)
  .on('mouseup', mouseup)

  function mouseup(){
    el.select('.inflate')
    .attr('class', 'ball')
    .attr('stroke-width', 1)
    .transition().duration(500)
    .attr('stroke-width', 0)
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

    node.datum({ position: point, velocity: velocity, r: 5, node: node })
    .attr('class', 'inflate')
    .attr('r', pluckWith('r'))
    .attr('stroke', 'white')
    .attr('transform', translate)
  }

  function step(d) {
	  d.velocity = merge(d.velocity, scale(gravity, .0000001))

    collide(d)

	  d3.select(this).attr('transform', translate)
  }

  function collide(d){
	  if (d.position[1] < bounds.y[0] - d.r) {
      d.node.transition().attr('fill'
                              ,"hsl(" + Math.random() * 360 + ", 100%, 50%)" )
      horizontal_friction(d.velocity)
		  d.velocity[1] *= -1.01
      d.velocity[1] = vertical_friction(d.velocity[1])
		  d.position[1] = bounds.y[0]
	  }

    if (d.position[1] > bounds.y[1] + d.r) {
      play_sound(d.position[0])

      horizontal_friction(d.velocity)
		  d.velocity[1] *= -1.01
      d.velocity[1] = vertical_friction(d.velocity[1])
		  d.position[1] = bounds.y[1]
	  }

	  d.position[0] =
      d.position[0] < bounds.x[0] ? bounds.x[1] :
      d.position[0] > bounds.x[1] ? bounds.x[0] : d.position[0]
 }

  function play_sound(x) {
    sound_test(x)
    //setSoundUrl('node' + xscale(x))
  }

  function vertical_friction (x) { return Math.abs(x) > 100 ? 1 : x * 1 }
  function horizontal_friction (c) { c[0] *= Math.random() * 2 * (Math.random > .5 ? -1 : 1) }

  function scale(vec, coef) { return [coef * vec[0], coef * vec[1]] }
  function sum(arr) { return arr.reduce(function (a, b) { return a + b }) }
  function merge () { return _.zip.apply(_, [].slice.call(arguments)).map(sum) }
  function translate(d) {
    return 'translate(' + (d.position = merge(d.position, d.velocity)).toString()  + ')'
  }
};
