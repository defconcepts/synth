_.extend(d3.selection.prototype,
         {
           pAttr: function (obj) {
             _.each(obj, function (v, k) { this[k] = pluckWith(v) })
             return athis.attr(obj)
           }

         , replace: function () {

           }
         , parent: function () {
             var self = this
             return this.each(function (_, i) {
                      self[0][i] = this.parentElement
                    })
           }
         , at: function (i) {
             return this.filter(function (d, _) { return _ == i })
           }
})

_.extend(Number.prototype,
         { toRad: function () {
             return this * Math.PI / 180
           }
         , toDeg: function () {
             return this * 180 / Math.PI
           }
         })

var arrayProto = {
  contains: function (item) {
    return ~ this.indexOf(item)
  },
  prepend: function () {
    this.unshift.apply(this, arguments)
    return this
  }
, append: function () {
    this.push.apply(this, arguments)
    return this
  }
, remove: function () {
    var args = _.toArray(arguments), i = 0
    while (i < args.length) this.splice(this.indexOf(args[i++]), 1)
    return this
  }
}

_.each(arrayProto, function (val, key) {
  Object.defineProperty(Array.prototype, key, {
    value: val
  , enumerable: false
  })
})

_.extend(d3.transition.prototype, {
});

_.extend(d3.selection.prototype, {
  emit: function (event) {
    var args = [].slice.call(arguments, 1)
    return this.each(function (d, i) {
             var fn = d3.select(this).on(event)
             fn && fn.apply(this, [d, i].concat(args))
           })
  }

, invoke: function (method) {
    var args = [].slice.call(arguments, 1)
    return this.each(function (d) { d[method].apply(d, args)  })
  }

, listen_for: function (fn){
    (_.isArray(fn) ? fn : [fn])
    .forEach(function (fn) {
      this.on(fn.name, fn)
    }, this)

    return this
  }

, once: function (event, listener, flag) {
    var self = this

    return this.on(event, on, flag)

    function on(datum, index) {
      self.on(event, null)
      listener.call(this, datum, index, flag)
    }
  }
})

_.mixin({
  partition: function (arr, fn) {
    var result = [[], []]
    arr.forEach(function (d, i) { result[+ fn(d, i, arr)].push(d) })
    return result
  }
, merge: function (a, b) {
    _.each(b, function (v, k) { if (a[k]) a[k] = v })
    return a
  }

})