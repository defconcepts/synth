this.worlds = [bounce, wind, table]

worlds.construct = function (name) {
  //freeze()
  //todo fix transition
  //isolate path
  var w = Session.get('world')
  this.el = d3.select('.glass').classed('show', 'true')
  var i = this.indexOf(_.findWhere(this, { name: name }))
  this.current = worlds[i](this.el, w && w.state || [])
  d3.select(window).once('keydown', keydown)
  return this.el
}

worlds.destruct = function () {
  window.freeze = false
  d3.select('.main').selectAll('*').attr('filter', '')
  this.current && this.current()
  this.el.classed('show', false).select('*').remove()
}

Meteor.startup(function () {
  window.location.pathname.length > 1 &&
    worlds.construct(window.location.pathname.slice(1))
})

function freeze () {
  window.freeze = true
  var main = d3.select('.main').selectAll('.emanating, .pulse').remove()
  main.selectAll('*').attr('filter', 'url(#blur)')
}

function keydown() {
  return d3.event.which === 27 ?
    worlds.destruct() :
    d3.select(this).once('keydown', keydown)
}
