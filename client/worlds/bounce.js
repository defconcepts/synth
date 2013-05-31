bounce = function(el) {
  console.log(el)
  var gravity = [0, 9.81]
    , bounds = { x: [0, innerWidth], y: [0, innerHeight - 60] }
    , scale = d3.scale.ordinal()
              .domain('abcdef'.split('')).rangePoints([0, innerWidth])
    , axis = d3.svg.axis().scale(scale).orient('bottom')

  el.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(25," + (innerHeight - 50) + ")")
  .call(axis);

  d3.select(document)
  .on('mousedown', mousedown)
  .on('mouseup', mouseup)

	d3.timer(function () {
    el.selectAll('.ball').each(step)
    var inflate = el.select('.inflate')
    inflate.empty() || inflate.attr('r', .1 + + inflate.attr('r'))
  })

  function mouseup(){
    console.log(el.node());
    log(el.select('.inflate').attr('class', 'ball').node())
  }

  function mousedown() {
	  spawn_ball([d3.event.pageX, d3.event.pageY],
               [Math.random() * 15 * (Math.random() > .5 ? 1 : -1)
               , Math.random() * 15 * (Math.random() > .5 ? 1 : -1)
               ])
  }

  function spawn_ball(point, velocity) {
    el.append('circle')
    .datum({ position: point, velocity: velocity })
    .attr('class', 'inflate')
    .attr('r', 10)
    .attr('transform', translate)
  }

  function step(d) {
	  d.velocity = merge(d.velocity, weight(GRAVITY, .000000001))

    collide(d)

	  d3.select(this).attr('transform', translate)
  }

  function collide(d){

	  if (d.position[1] < bounds.y[0]) {
      play_sound()
		  d.velocity[1] = - d.velocity[1]
		  d.position[1] = bounds.y[0]
	  }

    if (d.position[1] > bounds.y[1]) {
		  d.velocity[1] = - d.velocity[1]
		  d.position[1] = bounds.y[1]
	  }

	  d.position[0] =
      d.position[0] < bounds.x[0] ? bounds.x[1] :
      d.position[0] > bounds.x[1] ? bounds.x[0] : d.position[0]
  }


  function play_sound() {
    setSoundUrl('node' + ~~(Math.random() * 7));
  }

  function weight(vec, coef) { return [coef * vec[0], coef * vec[1]] }
  function sum(arr) { return arr.reduce(function (a, b) { return a + b }) }
  function merge () { return _.zip.apply(_, [].slice.call(arguments)).map(sum) }
  function translate(d) {
    return 'translate(' + (d.position = merge(d.position, d.velocity)).toString()  + ')'
  }
};
