Meteor.startup(function () {
  if (! Tracks.find().count())
    Tracks.insert({})

  if (! Graph.find().count())
    Graph.insert({ type: 'wind'
                 , edges: []
                 , x: 300
                 , y: 300
                 , belongsTo: Tracks.findOne()._id
                 })
})

Meteor.publish('allTracks', function () {
  return Tracks.find()
})

Meteor.publish('allGraph', function (trackId, old) {
  return Graph.find({ belongsTo: trackId })
})
