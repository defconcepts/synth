setTimeout(function () {
  Session.set('currentTrack', (Tracks.findOne() || {})._id)
}, 500)


Template.trackList.events({
  'mouseover .track': function () {
    switchTracks(this._id)
  }

, 'click .track': function () {
    d3.select('.dropdown').classed('hidden', true)
  }
, 'click .add': function () {
    switchTracks(Tracks.insert({ title: 'No Title' }))
  }
})

Template.trackList.selected = function () {
  return Session.get('currentTrack') == this._id ? 'selected' : ''
}

Template.trackList.track = function () {
  return Tracks.find()
}

Template.header.events({
  'click .browse': function () {
    var showDropdown = Session.get('showDropdown')
    Session.set('showDropdown', ! showDropdown)
    d3.select('.dropdown').classed('hidden', showDropdown)
  }

, 'keypress .title': function (e) {
    if (e.which == 13) e.target.blur()
  }

, 'blur .title': function (e) {
    Tracks.update({ _id: Session.get('currentTrack') },
                  { title: e.target.textContent })
  }
})

Template.header.currentTitle = function () {
  return (Tracks.findOne({ _id: Session.get('currentTrack') })  || {}).title
}

function switchTracks(id) {
  var old = Session.get('currentTrack')
  if (old == id) return console.log(456)
  window.k && k.stop()
  k = Meteor.subscribe('allGraph', id, old)
  Session.set('currentTrack', id)
}