var old

Deps.autorun(function () {
  var current = Session.get('currentTrack')
  if (old == current) return
  Meteor.subscribe('allGraph', current)
  Session.set('currentTrack', current)
  old = current
})