_.extend(d3.selection.prototype,
         { size: function () {
             var n = 0
             this.each(function () { n++ })
               return n
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
             return d3.select(this[0][i])
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

_.extend(Array.prototype,
         { prepend: function () {
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
         })

_.extend(d3.transition.prototype, {
  size: function () {
    var i = 0
    this.each(function () { i++ })
      return i
  }
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
})