var worlds = this.worlds = [bounce, wind]

worlds.construct = function (i) {
  //freeze()
  //todo fix transition
  //isolate path
  var w = Session.get('world')
  this.el = d3.select('.glass').classed('show', 'true')
  this.current = worlds[this.indexOf(i)](this.el.append('svg'), w && w.state || [])
  return this.el
}

worlds.destruct = function () {
  window.freeze = false
  d3.select('.main').selectAll('*').attr('filter', '')
  this.current && this.current()
  this.el.classed('show', false).select('svg').remove()
}

Meteor.startup(function () {
  _.find(worlds, function (w) { return location.href.match(w.name) }) &&
    worlds.construct()
})

function freeze () {
  window.freeze = true
  var main = d3.select('.main').selectAll('.emanating, .pulse').remove()
  main.selectAll('*').attr('filter', 'url(#blur)')
}