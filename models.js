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
    , within: function (extent) {
        return extent[0][0] <= this.x &&
         this.x < extent[1][0] &&
         extent[0][1] <= this.y &&
         this.y < extent[1][1]
      }
    }



function transform(doc) {
  return _.extend(Object.create(Node),
           _.omit(doc, 'selected'))
}
