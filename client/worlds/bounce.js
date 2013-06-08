bounce = function bounce(el) {
  var gravity = [0, .5]
    , bounds = { x: [0, innerWidth], y: [0, innerHeight - 50] }

    , xscale = d3.scale.linear()
               .range([0, innerWidth - 50])
               .domain([0, 6])

    , axis = d3.svg.axis().scale(xscale).orient('bottom').ticks(6)
             .tickFormat(function (d) { return 'abcdefg'.split('')[~~d] })

  el.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(25, " + bounds.y[1] + ")")
  .call(axis)

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
    .attr('fill', rand_color())
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

    force(d)

	  d3.select(this).attr('transform', translate)
  }

  function force(d) {
    var bot = d.position[1] + d.r > bounds.y[1]
      , top = d.position[1] - d.r < bounds.y[0]

    if (top || bot) apply_friction(d)
    if (bot) play_sound(d.position[0])

	  d.position[0] =
      d.position[0] < bounds.x[0] ? bounds.x[1] :
      d.position[0] > bounds.x[1] ? bounds.x[0] : d.position[0]
 }

  function apply_friction(d) {
    horizontal_friction(d.velocity)
    vertical_friction(d.velocity)
  }

  function play_sound(x) {
    sound_test(~~ xscale.invert(x))
  }

  function rand_color() { return "hsl(" + Math.random() * 360 + ", 100%, 50%)" }

  function vertical_friction (v) { v[1] = Math.abs(v[1]) > 100 ? 1 : v[1] *= -1.01 }
  function horizontal_friction (v) { v[0] *= Math.random() * 2 * r_invert() }

  function r_invert() { return Math.random > .5 ? -1 : 1 }

  function scale(vec, coef) { return [coef * vec[0], coef * vec[1]] }
  function sum(arr) { return arr.reduce(function (a, b) { return a + b }) }
  function merge () { return _.zip.apply(_, [].slice.call(arguments)).map(sum) }
  function translate(d) {
    return 'translate(' + (d.position = merge(d.position, d.velocity)).toString()  + ')'
  }
}


function x() {
  return someCondition ? thing1 :
    someOtherCondition ? thing2 :
    thing1;
}
