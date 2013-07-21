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

_.extend(d3.selection.prototype, {
  emit: function (event) {
    var args = [].slice.call(arguments, 1)
    return this.each(function (d, i) {
             var fn = d3.select(this).on(event)
             fn && fn.apply(this, [d, i].concat(args))
           })
  },

  invoke: function (method) {
    var args = [].slice.call(arguments, 1)
    return this.each(function (d) { d[method].apply(d, args)  })
  }

, listen_for: function (fn){
    //TODO switch to delegation

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
