function Signal(data) {
  this.contents = data
}

Signal.prototype = {
  transform: function (fn) {
    this.contents = this.contents.map(fn)
  },

  play: function() {
    playSound()
  }
}