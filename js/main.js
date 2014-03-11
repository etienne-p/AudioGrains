function render(canvas, w, h, cells) {
	var side = 20,
		ctx = canvas.getContext('2d'),
		i = 0,
		len = cells.length;

	ctx.clearRect(0, 0, (canvas.width = w * side), (canvas.height = h * side));
	ctx.font = "12px Arial bold";
	for (i = 0; i < len; ++i) {
		ctx.fillText(cells[i], side * (i % w), 20 + side * Math.floor(i / w));
	}
}

function main() {

	var w = 6,
		h = 4,
		canvas = document.createElement('canvas'),
		automaton = new Automaton(w, h);

	document.getElementsByTagName('body')[0].appendChild(canvas);

	automaton.rule = AutomatonRule.countNeighbors;

	function loop() {
		render(canvas, w, h, automaton.update());
		//requestAnimationFrame(loop);
	}
	loop();
}

window.onload = main;