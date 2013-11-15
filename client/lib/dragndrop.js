function dragndrop () {
  d3.select('body')
      .on("dragenter", dragmisc)
      .on("dragexit", dragmisc)
      .on("dragover", dragmisc)
      .on("drop", drop);
}

function dragmisc() {
  d3.event.stopPropagation();
  d3.event.preventDefault();
}

function drop() {
  var e = d3.event
    , fr = new FileReader()
    , files = e.dataTransfer.files
    , count = files.length

  fr.onloadend = loadend
}

function loadend () {
  var contents = this.result
}