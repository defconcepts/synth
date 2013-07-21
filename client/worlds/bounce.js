this.bounce = function b(el, data) {
  var gravity = [0, .5]

    , offsetX = innerWidth * .05, offsetY = innerHeight * .05

    , bounds = { x: [0, innerWidth * .9]
               , y: [0, innerHeight * .9] }

    , xscale = d3.scale.linear()
               .range([0, innerWidth * .9])
               .domain([0, 6])

    , axis = d3.svg.axis().scale(xscale).orient('bottom').ticks(6)
             .tickFormat(function (d) { return 'abcdefg'.split('')[~~d] })

    , done = false

  el.selectAll('circle').data(data).enter()
  .append('circle')
  .attr('fill', rand_color)
  .attr('class', 'ball')
  .attr('r', pluckWith('r'))

  el.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(25, ' + bounds.y[1] + ')')
  .call(axis)

	d3.timer(function () {
    _.each(data, step)
    el.select('.inflate').attr('r', function (d) { return ++d.r })
    el.selectAll('.ball').attr('transform', translate)
    return done
  })

  d3.select(document)
  .on('mousedown.bounce', mousedown)
  .on('mouseup.bounce', mouseup)

  return function () {
    done = true
    var state = _.map(el.selectAll('.ball').data(), omit)

    Graph.update({ _id: Session.get('world')._id },
                 { $set: { state: state } }
                )

    d3.select(document)
    .on('mousedown.bounce', null)
    .on('mouseup.bounce', null)

    function omit (d) {
      return _.omit(d, 'node')
    }
  }

  function mouseup(){
    el.select('.inflate')
    .attr('class', 'ball')
    .attr('stroke-width', 1)
    .transition().duration(500)
    .attr('stroke-width', 0)
    .attr('fill', rand_color())
  }

  function mousedown() {
	  spawn_ball([ d3.event.pageX - offsetX, d3.event.pageY - offsetY],
               [ Math.random() * 15 * r_invert()
               , Math.random() * 15 * r_invert()
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
    var bot = d.position[1] + d.r > bounds.y[1]
      , top = d.position[1] - d.r < bounds.y[0]

	  d.velocity = merge(d.velocity, scale(gravity, .0000001))

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
    d3.selectAll('.edge')
    .filter(function (d) { return d.source._id === Session.get('world')._id })
    .each(pulse)

    sound_test(~~ xscale.invert(x))
  }

  function rand_color() { return 'hsl(' + Math.random() * 360 + ', 100%, 50%)' }

  function vertical_friction (v) { v[1] = Math.abs(v[1]) > 100 ? 1 : v[1] *= -1.01 }
  function horizontal_friction (v) { v[0] *= Math.random() * 2 * r_invert() }

  function r_invert() { return Math.random() > .5 ? -1 : 1 }

  function scale(vec, coef) { return [coef * vec[0], coef * vec[1]] }
  function sum(arr) { return arr.reduce(function (a, b) { return a + b }) }
  function merge () { return _.zip.apply(_, [].slice.call(arguments)).map(sum) }
  function translate(d) {
    return 'translate(' + (d.position = merge(d.position, d.velocity)).toString()  + ')'
  }
}
