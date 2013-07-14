this.Graph = new Meteor.Collection('graph', { transform: transform });

this.Node =
  { radius: 20
  , save: function (update) {
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
  , connected: function (target) {
      return _.contains(this.edges, target._id) ? 1 :
        _.contains(target.edges, this._id) ? -1 :
        0;
    }
  , getNode: function () {
      var _id = this._id
      return Meteor.isClient && d3.selectAll('.node')
                                .filter(function (d) { return d._id === _id })
    }
  }



function transform(doc) {
  return _.extend(Object.create(Node),
                  _.omit(doc, 'selected'))
}
