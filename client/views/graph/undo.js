var history = []
  , undone = []
  , reverting = false

Meteor.startup(function () {
  Graph.find().observe({
   changed: function (newDoc, oldDoc) {
      if (! reverting) history.push({newDoc: newDoc, oldDoc: oldDoc})
    }
  })
})

this.redo = function () {
  if (! undone.length) return
  var k = undone.pop()
  history.push(k)
  reverting = true
  Graph.update({_id: k.newDoc._id }, k.newDoc, function () {
    reverting = false
  })
}

this.undo = function () {
  if (! history.length) return
  var k = history.pop()
  undone.push(k)
  reverting = true
  Graph.update({_id: k.newDoc._id }, k.oldDoc, function () {
    reverting = false
  })
}