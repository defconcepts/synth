worlds = [bounce]

worlds.construct = function () {
  d3.selectAll('.graph ,.brush')
  .style('display', 'none')
  this.current = worlds[0](d3.select('.worlds'), Session.get('world').state)
}

worlds.destruct = function () {
  this.current()
  d3.selectAll('.worlds *').remove()
  d3.selectAll('.graph ,.brush')
  .style('display', 'block')
}

Meteor.startup(function () {
  _.find(worlds, function (w) { return location.href.match(w.name) }) &&
    worlds.construct()
})

function View() {
  var el  = DomUtils.htmlToFragment('<g>')
  var events = {}
  _.toArray(arguments).reduce(function (hash, fn) {
    hash[fn.name] = fn(el.select('.' + fn.name), events)
    return hash
  }, {});
}

View.prototype = {
  construct: function () {
    listen(this.events)
  },
  destruct: function () {

  }
}
