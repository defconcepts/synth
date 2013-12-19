Meteor.startup(function () {
  if (! sn.Tracks.find().count())
    sn.Tracks.insert({ title: 'Monkey brains' })

  if (! sn.Graph.find().count())
    sn.Graph.insert({ type: 'wind'
                 , edges: []
                 , x: 300
                 , y: 300
                 , belongsTo: sn.Tracks.findOne()._id
                 })
})

Meteor.publish('allTracks', function () {
  return sn.Tracks.find()
})

Meteor.publish('allGraph', function (trackId) {
  return sn.Graph.find({ belongsTo: trackId })
})


Meteor.methods({
  clear_db: function() {
    sn.Graph.find().forEach(function (model) {
      sn.Graph.remove({_id: model._id})
    })
  }
})