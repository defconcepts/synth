//Meteor.subscribe('history')
Meteor.subscribe('allTracks')

Deps.autorun(function () {
  Meteor.subscribe('allGraph', Session.get('currentTrack'))
})
