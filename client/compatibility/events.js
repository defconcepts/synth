//DEPS
as_events = events()

function events() {
  var id = 0

  function before ( ) {}
  function after ( ) {}

  function next(fn, root) {
    return root.next ?
      next(fn, root.next) :
      root.next = fn
  }

  function m(){
    return  function () {}
  }

  function on(name, fn, ctx) {
    if (! fn) return this._events[name]
    fn.id = ++id
    fn.ctx = ctx || {}
    next(fn, this._events[name] || (this._events[name] = new m))
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
    var args = [].slice.call(arguments, 1)
      , fn = this._events[name]

    do fn.apply(fn.ctx, args)
    while (fn = fn.next)

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
