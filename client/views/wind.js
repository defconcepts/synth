this.wind = wind
wind.step = step
wind.class = 'processor'

function wind (el, data) {
  d3.timer(loop)

  var num_streams = 3e3
    , max_age = 30
    , fade_rate = 0.05
    , border = 100
    , done = false
    , ms_per_repeat = 1000

    , w = el.node().offsetWidth
    , h = el.node().offsetHeight

    , canvas = el.append('canvas')
               .attr('width', w)
               .attr('height', h).node()
      , cx = canvas.getContext("2d")

    , streams = initStreams()

    , velocity = to_px(10, julia(0, 15))
    , first_timestamp

  cx.strokeStyle = "rgba(0, 255, 255, .5)"
  cx.fillStyle = "rgba(255, 0, 255, .5)"
  cx.fillRect(0, 0, w, h)
  d3.select(canvas).on('click', function () {
    jules *= -1
  })

  return function () {
    done = true
  }

  function fadeCanvas(alpha) {
    cx.save()
    cx.globalAlpha = alpha
    cx.globalCompositeOperation = "copy"
    cx.drawImage(canvas, 0, 0)
    cx.restore()
  }

  function initStreams() {
    var streams = [], i = -1
    while (++i < num_streams)
      streams.push([ Math.round(Math.random() * (w + 2*border)) - border
                   , Math.round(Math.random() * (h + 2*border)) - border
                   , Math.round(Math.random() * max_age) + 1
                   ])
    return streams
  }

  function frame(t) {
    fadeCanvas(1 - fade_rate)

    cx.save()
    cx.setTransform(1, 0, 0, 1, 0, 0)
    var i = -1
    while (++i < streams.length) {
      var stream = streams[i]
      if (stream[2] == 0) {
        stream[0] = ~~ (Math.random() * (w + 2*border)) - border
        stream[1] = ~~ (Math.random() * (h + 2*border)) - border
        stream[2] = 30
      }

      var v = velocity(stream[0], stream[1], t)

      if (v[0] <= w && v[1] <= h) {
        cx.beginPath()
        cx.moveTo(stream[0], stream[1])
        cx.lineTo(stream[0] += v[0], stream[1] += v[1])
        cx.stroke()

      }
      stream[2]--
    }
    cx.restore()
  }


  function loop(timestamp) {
    if (! first_timestamp) first_timestamp = timestamp
    frame(((timestamp - first_timestamp) % ms_per_repeat) / ms_per_repeat)
    return done
  }

  function to_px(n, f) {
    return function(x_px, y_px, t) {
      var divisor = Math.min(canvas.width, canvas.height) / n
        , x = (x_px - canvas.width/2) / divisor
        , y = (y_px - canvas.height/2) / divisor
      return f(x, y, t)
    }
  }
}

function step () {
  return []
}

var jules = -4

function julia(dx, dy) {
  return function(x, y, t) {
    return [ x*x - y*y + dx - x
           , jules*x*y + dy - y
           ]
  }
}
