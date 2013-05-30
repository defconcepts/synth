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
