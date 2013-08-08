this.wind = wind
wind.step = step

function wind (el, data) {
  var NUM_STREAMS = 1e3
    , MAX_AGE = 30
    , FADE_RATE = 0.05
    , BORDER = 100
    , done = true

  var w = el.node().offsetWidth
    , h = el.node().offsetHeight

  var canvas = el.append('canvas')
               .attr('width', w)
               .attr('height', h).node()
    , cx = canvas.getContext("2d")
    , streamer =
    Streamer({ canvas: canvas
             , num_streams: NUM_STREAMS
             , max_age: MAX_AGE
             , fade_rate: FADE_RATE
             , border: BORDER
             , velocity: to_px(10, julia(0, 15))
             })

  cx.strokeStyle = "rgba(0,255,255,0.1)"
  cx.fillStyle = "rgba(255,0,255, .5)"
  cx.fillRect(0, 0, canvas.width, canvas.height)
  streamer.start()

  // * Vector field transformers
  // Transform a vector field from origin-centred coordinates to pixel coords
  function to_px(n, f) {
    return function(x_px, y_px, t) {
      var divisor = Math.min(canvas.width, canvas.height) / n
        , x = (x_px - canvas.width/2) / divisor
        , y = (y_px - canvas.height/2) / divisor
      return f(x, y, t)
    };
  }

  // * Primitive vector fields
  function julia(dx, dy) {
    return function(x, y, t) {
      return [ x*x - y*y + dx - x
             , 2*x*y + dy - y
             ]
    }
  }

  return function () {
    done = true
    //update graph
    streamer.stop()
  }

  return function () {
    done = true
    //update graph
    streamer.stop()
  }
}

function step () {}

function Streamer(options) {
  var canvas = options.canvas
    , cx = canvas.getContext("2d")
    , w = canvas.width
    , h = canvas.height

    , num_streams = options.num_streams || 1000
    , ms_per_repeat = options.ms_per_repeat || 1000
    , max_age = options.max_age || 10
    , fade_rate = options.fade_rate || 0.02
    , border = options.border || 100
    , velocity = options.velocity

  function fadeCanvas(alpha) {
    cx.save()
    cx.globalAlpha = alpha
    cx.globalCompositeOperation = "copy"
    cx.drawImage(canvas, 0, 0)
    cx.restore()
  }

  var streams = initStreams()

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
    fadeCanvas(1 - fade_rate);

    cx.save();
    cx.setTransform(1, 0, 0, 1, 0, 0);

    for (var i=0; i<streams.length; i++) {
      var stream = streams[i];
      if (stream[2] == 0) {
        stream[0] = Math.round(Math.random() * (w + 2*border)) - border;
        stream[1] = Math.round(Math.random() * (h + 2*border)) - border;
        stream[2] = 30;
      }

      var v = velocity(stream[0], stream[1], t);
      if (v[0] <= w && v[1] <= h) {
        cx.beginPath();
        cx.moveTo(stream[0], stream[1]);
        cx.lineTo(stream[0] + v[0], stream[1] + v[1]);
        cx.stroke();

        stream[0] += v[0];
        stream[1] += v[1];
      }
      stream[2]--;
    }

    cx.restore();
  }

  var first_timestamp, animation_frame_id;
  function loop(timestamp) {
    if (!first_timestamp) first_timestamp = timestamp;
    frame(((timestamp - first_timestamp) % ms_per_repeat) / ms_per_repeat);
    animation_frame_id = requestAnimationFrame(loop)
  }

  return {
    "start": function() { animation_frame_id = requestAnimationFrame(loop); },
    "stop": function() { cancelAnimationFrame(animation_frame_id); }
  };
}