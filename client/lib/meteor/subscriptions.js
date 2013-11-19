//Meteor.subscribe('history')
Meteor.subscribe('allTracks')

var old

Deps.autorun(function () {
  var current = Session.get('currentTrack')
  Meteor.subscribe('allGraph', current)
  Session.set('currentTrack', current)
  old = current
})
