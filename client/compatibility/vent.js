exports(vent, off, emit, emit_later)
vent.listen = listen('')


function vent(klass) {
  return { listen: listen(klass)}
}

function listen(klass) {
  return function (arr) {
    var i = arr.length;
    while(i--) vent[klass + arr[i].name] = arr[i]
  }
}

function off(event, fn) {
  var root = this.events[event]

  while(root = root.next)
    if (root.next === fn) root.next = root.next.next

  return this
}

function emit(name) {
  var args = [].slice.call(arguments, 1)
    , fn = vent[name]

  return fn && fn.apply(fn.ctx, args)
}

function emit_later(evt) {
  var args = [evt].concat(_.rest(arguments))
  return function () {
    emit.apply(null, args.concat(_.toArray(arguments)))
  }
}