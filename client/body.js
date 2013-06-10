var events  =
    [ 'click',
      'dblclick',
      'focus',
      'blur',
      'change',
      'mouseenter',
      'mouseleave',
      'mousedown',
      'mouseup',
      'keydown',
      'keypress',
      'keyup',
      'tap',
      'resize'
    ]

events.reduce(reduce, {})

Template.body.events(events)

function reduce(acc, i) {
  acc[i] = delegate(i)
  return acc
}

function delegate(name) {
  vent[name] = function (e) {
    var klass = e.target.className.split(' '), i = klass.length
    while(i--) vent.emit(name + klass[i])
  }
}


//vent('class').listeners()