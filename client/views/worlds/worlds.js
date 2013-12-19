sn.worlds.construct = function (name) {
  //freeze()
  //todo fix transition
  //isolate path
  var w = Session.get('world')
  this.el = d3.select('.glass').classed('show', 'true')
  this.current = this[name](this.el, w && w.state || [])
  d3.select(window).once('keydown', keydown)
  return this.el
}

sn.worlds.destruct = function () {
  window.freeze = false
  d3.select('.main').selectAll('*').attr('filter', '')
  Session.set('world', {})
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
    sn.worlds.destruct() :
    d3.select(this).once('keydown', keydown)
}
