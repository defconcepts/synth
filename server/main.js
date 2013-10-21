Meteor.startup(function () {
  if (! Graph.find().count())
    Graph.insert({ type: 'wind'
                 , edges: []
                 , x: 300
                 , y: 300
                 , belongsTo: Meteor.uuid()
                 })
})

Meteor.publish('allTracks', function () {
  return Tracks.find()
})

Meteor.publish('allGraph', function (shit) {
  console.log(shit)
  return Graph.find()
})
