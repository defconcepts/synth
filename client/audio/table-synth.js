this.playTableSound = function(){ 
	createFunctionName = ['createOscillator']

	function create(ctx, name) {
		var node = ctx[name]();
		node.connect(ctx.destination);
		return node;
	}

	var osc = create(this.context, createFunctionName[0])

	osc.start(0)
	console.log("osc = " + osc)

	function stopNode(node, delay) {
		function stop() {
			node.stop(0);
		};
		window.setTimeout(stop, delay);
		node.disconnect();
	}

	stopNode(osc, 1000)
}

this.playTest = function() {
	var node = context.createOscillator();
	console.log("node is = " + node);
	node.connect(context.destination);

	node.start(0);
	function stop() {
		node.stop(0);
	};
	window.setTimeout(stop, 1000);

}
this.playTest();
// this.playTableSound()
