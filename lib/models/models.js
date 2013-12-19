this.sn = {}
sn.Graph = new Meteor.Collection('graph', { transform: transform })
sn.Tracks = new Meteor.Collection('tracks')


var types = this.node_types = {
  bounce:'#C02942'
, wind: '#53777A'
, table: 'royalblue'
, piano: '#D95B43'
  // , heat: '#ECD078'
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
      sn.Graph.update({ _id: this._id }, _.extend(this, update), cb)
    }

  , clone: function () {
      return transform(_.clone(this))
    }

  , destroy: function (){
      sn.Graph.remove({ _id: this._id })
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
        0
    }
  , getNode: function () {
      var _id = this._id
      return Meteor.isClient &&
        d3.selectAll('.node').filter(function (d) { return d._id === _id })
    }
  }

function transform(doc) {
  return _.extend(Object.create(Node),
                  _.omit(doc, 'selected'),
                  _.clone(params[doc.type])
                 )
}

var params = {
  oscillator: 'attack decay sustain release gain'
, filter: 'wet/dry roomsize decay'
, reverb: 'cutoff resonance'
}

_.each(params, function (v, k) {
  params[k] = v.split(' ').reduce(function (a, b) { a[b] = 100; return a }, {})
})

var mappings = {
  sequencer: ['table', 'bounce']
}

sn.newNode = function (pos, edges) {
  var type = rand_type()
  return _.extend({ type: type
                  , edges: edges
                  , x: pos[0]
                  , y: pos[1]
                  , state: _.clone(sn.worlds[type].schema)
                  , belongsTo: Session.get('currentTrack')
                  , params: params.oscillator
                  })
}

//contextual menu
//readd brush
//dropdowns
