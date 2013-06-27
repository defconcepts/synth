d3.selection.prototype.size = function () {
  var n = 0;
  this.each(function () { n++ })
  return n
}

d3.selection.prototype.tooltip = function (options) {
  if (this.size() > 1)
    this.each(function () { d3.select(this).tooltip(options) })

  var self = this
    , node = this.node()
    , whxh = node.getBoundingClientRect()
    , data = 'bounce wind gummy bounce trampoline abc def no no no abc'
             .split(' ')

  var t = d3.select('body')
          .append('div')
          .attr('class', 'tooltip')
          .style('top', whxh.top - 75 + 'px')
          .style('left', whxh.left - 75 + 'px')

  t.append('span')
  .attr('class', 'title')
  .text('type')

  t.append('ul')
  .style('overflow', 'scroll')
  .style('height', '100px')
  .selectAll('li')
  .data(data)
  .enter().append('li')
  .text(function (d) { return d })
  .on('click', function (d) { t.remove(); self.datum().world = d })

  t.append('div')
  .attr('class', 'arrow')
  .style({})
}