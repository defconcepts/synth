var mixme = (function () {

  function area() {}

  return function () {
    this.area = area;
  }

})();


function module(fn, el) {
  el = d3.select(el)
  var self = function (set) { return arguments.length ? node = set : node }
  mixme(self)

  fn.call(self, el)
}