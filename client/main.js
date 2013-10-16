[resize, graph]
.forEach(Meteor.startup)

//debounce if this gets slow
$(window).on('resize', resize)
function resize() {
  Session.set('width', innerWidth)
  Session.set('height', innerHeight)
}

Session.setDefault('world', {})