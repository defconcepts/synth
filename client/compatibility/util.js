exports(exports, sine, clear_db, mirror, pluckWith, matchWith, swap, circle)

log = console.log.bind(console)

function exports() {
  var i = arguments.length
  while (i--) window[arguments[i].name] = arguments[i]
}

function sine(n){
  return  0.5 * (1 - Math.sin(n))
}


function clear_db() {
  Graph.find().forEach(function (model) {
    Graph.remove({_id: model._id})
  })
}
function dist(a, b) {
  a = _.isArray(a) ? toCoord(a) : a
  b = _.isArray(b) ? toCoord(b) : b
  var xd = a.x - b.x
    , yd = a.y - b.y

  return Math.sqrt(xd * xd + yd * yd)
}

function mirror(f) {
  if ("function" !== typeof f) f = d3.ease.apply(d3, arguments)

  return function(t) {
    return t < .5 ? f(2 * t) : f(2 - 2 * t)
  }
}

function random_color() {
  return COLORS[~~(Math.random() * COLORS.length)]
}

function pluckWith(name){
  return function (obj) {
    function red(_, item) { return obj = obj[item] || null }
    return name.split('.').reduce(red, obj)
  }
}

function toCoord(arr) {
  return { x: arr[0], y: arr[1] }
}

function matchWith(obj, prop) {
  return function (ect) {
    return obj[prop] === ect[prop]
  }
}


function circle(selection, data) {
  (data ? selection.data(_.isArray(data) ? data : [data]) : selection )
  .attr('cx', pluckWith('x'))
  .attr('cy', pluckWith('y'))
  .attr('fill', pluckWith('fill'))
  .attr('r', pluckWith('radius'))
  .attr('class', pluckWith('class'))
}

function swap (obj, prop1, prop2) {
  var swap = obj[prop1]
  obj[prop1] = obj[prop2]
  obj[prop2] =  swap
  return obj
}
