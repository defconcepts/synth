window.sn = {}
sn.provide = function (path) {
  var scope = []
  path = path.split('.')
  while(path.length) sn[scope + '.' + path.pop()] = {}
}