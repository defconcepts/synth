//Meteor.subscribe('history')
Meteor.subscribe('allTracks')

Deps.autorun(function () {
  console.log('change the track')
  Meteor.subscribe('allGraph', Session.get('currentTrack'))
})
