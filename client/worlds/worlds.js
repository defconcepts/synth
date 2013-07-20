var worlds = this.worlds = [bounce]

worlds.construct = function () {
  window.freeze = true
  var main = d3.select('.main').selectAll('.emanating, .pulse').remove()
  main.selectAll('*').attr('filter', 'url(#blur)')
  this.el = d3.select('.glass').classed('show', 'true').style({
    height: .9 * innerHeight
  , width: .9 * innerWidth
  })
  this.current = worlds[0](this.el.append('svg'), Session.get('world').state)
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