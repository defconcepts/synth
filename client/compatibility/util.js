log = console.log.bind(console)

destroy = function () {
  Graph.find().forEach(function (model) {
    Graph.remove({_id: model._id})
  })
}

dist = function(a, b) {
  var xd = a[0] - b[0]
    , yd = a[1] - b[1]

  return Math.sqrt(xd * xd + yd * yd)
}

mirror = function(f) {
  if ("function" !== typeof f) f = d3.ease.apply(d3, arguments)

  return function(t) {
    return t < .5 ? f(2 * t) : f(2 - 2 * t)
  }
}

random_color = function() {
  return COLORS[~~(Math.random() * COLORS.length)]
}

pluckWith = function (name){
  var n
  function get(o) {
    return n.length ? get(o[n.shift()]) : o
  }

  return function (obj) {//this
    n = name.split('.')
    return _.isArray(obj) ? obj.map(get) : get(obj)
  }
}

k = function (name){
  function get(o) {
    function reduce (_, item) { return o = o[item] || null }
    return name.split('.').reduce(reduce, o)
  }

  return function (obj) {
    return _.isArray(obj) ? obj.map(get) : get(obj)
  }
}

pluck = function (name) {
  return function get(obj) {
    var str = name.split('.'), i = 0, ret
    while(i < str.length) obj = obj[str[i++]] || null
    return obj
  }
}

function module() {
  return module;
}
