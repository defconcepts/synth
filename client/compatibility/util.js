exports(exports, sine, clear_db, mirror, pluckWith)

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
  var xd = a[0] - b[0]
    , yd = a[1] - b[1]

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
