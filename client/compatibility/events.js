as_events = events()

function events() {
  function before () {}
  function after () {}

  function next(fn, root) {
    return root.next ?
      next(fn, root.next) :
      root.next = fn
  }

  function on(name, fn, ctx) {
    if (! fn) return this._events[name]
    fn.ctx = ctx || {}
    next(fn, this._events[name] || (this._events[name] = function () {}))
    return this
  }

  function once(event, fn, ctx) {}

  function many (event, times, fn, ctx) {}

  function off(event, fn) {
    var root = this.events[event]

    while(root = root.next)
      if (root.next === fn) root.next = root.next.next

    return this
  }

  function emit(name) {
    var args = [].slice.call(arguments, 1), fn

    for (fn = this._events[name]; fn = fn.next;) fn.apply(fn.ctx, args)

    return this
  }

  function later(evt) {
    var self = this, args = [evt].concat(_.rest(arguments))
    return function () {
      self.emit.apply(self, args.concat(_.toArray(arguments)))
    }
  }


  function mix() {
    this._events = {}
    this.before = before
    this.on = on
    this.once = once
    this.off = off
    this.emit = emit
    this.later = later
    return this
  }

  return function (self) {
    return mix.call(self)
  }
}
