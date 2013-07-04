Graph = new Meteor.Collection('graph', { transform: transform });

var Node =
    { save: function (update) {
        Graph.update({ _id: this._id }, _.extend(this, update))
      }
    , clone: function () {
        return transform(_.clone(this))
      }
    , destroy: function (){
        Graph.remove({ _id: this._id })
      }
    }


function transform(doc) {
  return _.extend(Object.create(Node),
           _.omit(doc, 'selected'))
}
