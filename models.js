this.Graph = new Meteor.Collection('graph', { transform: transform });

var types = this.node_types =
  { bounce:'#C02942'
  , wind: '#53777A'
    // , lightning: '#D95B43'
    // , water: '#ECD078'
    // , heat: '#542437'
  }

this.rand_type = rand_type
this.node_fill = _.compose(function (type) { return types[type] },
                           pluckWith('type'))

function rand_type () {
  var k = _.keys(types), l = k.length
  return k[~~ (Math.random() * l)]
}

this.Node =
  { radius: 20

  , save: function (update, cb) {
      Graph.update({ _id: this._id }, _.extend(this, update), cb)
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
      return Meteor.isClient &&
        d3.selectAll('.node').filter(function (d) { return d._id === _id })
    }
  }

function transform(doc) {
  return _.extend(Object.create(Node),
                  _.omit(doc, 'selected')
                 )
}
