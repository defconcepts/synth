worlds = [bounce]

worlds.construct = function () {
  d3.selectAll('.graph ,.brush')
  .style('display', 'none')
  worlds[0](d3.select('.worlds'))
}

worlds.destruct = function () {
  d3.selectAll('.graph ,.brush')
  .style('display', 'block')
}

Meteor.startup(function () {
  _.find(worlds, function (w) { return location.href.match(w.name) }) &&
    worlds.construct()
})


//simple view framework
function View() {
  var el  = DomUtils.htmlToFragment('<g>')
  var events = {}
  _.toArray(arguments).reduce(function (hash, fn) {
    hash[fn.name] = fn(el.select('.' + fn.name), events)
    return hash
  }, {});
}


//explain
//()()()()()()()()()()()()()()()()()()()()()()()
View.prototype = {
  construct: function () {
    listen(this.events)
  },
  destruct: function () {

  }
}
