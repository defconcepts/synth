gradients = function (svg) {
  var body, def, globe_highlight, globe_shading, grad, ocean_fill, svg;
      ocean_fill = svg.append("defs").append("radialGradient").attr("id", "ocean_fill").attr("cx", "75%").attr("cy", "25%");
      ocean_fill.append("stop").attr("offset", "5%").attr("stop-color", "#ddf");
      ocean_fill.append("stop").attr("offset", "100%").attr("stop-color", "#9ab");
      def = svg.append("defs");
      globe_highlight = def.append("radialGradient").attr("id", "globe_highlight").attr("cx", "75%").attr("cy", "25%");
      globe_highlight.append("stop").attr("offset", "5%").attr("stop-color", "#ffd").attr("stop-opacity", "0.6");
      globe_highlight.append("stop").attr("offset", "100%").attr("stop-color", "#ba9").attr("stop-opacity", "0.2");
      globe_shading = def.append("radialGradient").attr("id", "globe_shading").attr("cx", "50%").attr("cy", "40%");
      globe_shading.append("stop").attr("offset", "50%").attr("stop-color", "#9ab").attr("stop-opacity", "0");
      globe_shading.append("stop").attr("offset", "100%").attr("stop-color", "#3e6184").attr("stop-opacity", "0.3");
      grad = def.append('linearGradient').attr({
        id: 'brush',
        x1: '0%',
        x2: '0%',
        y1: '0%',
        y2: '100%',
        r: '200%',
        gradientUnits: 'userSpaceonUse'
      }).selectAll('stop').data(['#a7c8d6', '#7089b3']).enter().append('stop').attr({
        'stop-color': function(d) {
          return d;
        },
        offset: function(d, i) {
          return i;
        }
      });

}
