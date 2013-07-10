_.extend(Array.prototype, {
  remove: function () {
    var args = _.toArray(arguments), i = 0
    while (i < args.length) this.splice(this.indexOf(args[i++]), 1)
    return this
  }
})

_.extend(d3.selection.prototype, {

  listen_for: function (fn){
    //TODO switch to delegation

    (_.isArray(fn) ? fn : [fn])
    .forEach(function (fn) {
      this.on(fn.name, fn)
    }, this)

    return this
  },

  once: function (event, listener, flag) {
    var self = this

    return this.on(event, on, flag)

    function on(datum, index) {
      self.on(event, null)
      listener.call(this, datum, index, flag)
    }
  }
})



//replaceWith

_.extend(HTMLElement.prototype, {
  once: function (e, fn, flag) {
    return d3.select(this).once(e, fn, flag)
  }
})