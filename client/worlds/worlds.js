worlds = [bounce]

worlds.construct = function () {
  d3.selectAll('.graph ,.brush')
  .style('display', 'none')
  worlds[0](d3.select('.worlds'))
}

worlds.destruct = function () {
  d3.selectAll('.graph ,.brush')
  .style('display', 'block')
}

setTimeout(function () {
  var test = _.find(worlds, function (w) { return location.href.match(w.name) })
  window.location.hostname == 'localhost' && test && worlds.construct(test)
}, 250)