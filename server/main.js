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
  var self = this
  // old && Graph.find({ belongsTo: old }).forEach(function (doc) {
  //          console.log(doc._id)
  //          self.removed('graph', doc._id)
  // })
  return Graph.find({ belongsTo: trackId })
})
