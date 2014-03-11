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

	var w = 4 * 4,
		h = 4 * 2,
		canvas = document.createElement('canvas'),
		automaton = new Automaton(w, h);

	document.getElementsByTagName('body')[0].appendChild(canvas);

	function rndInt(min, max) {
		return Math.floor(min + (max - min) * Math.random());
	}

	var q = rndInt(2, 255),
		k1 = rndInt(1, 8),
		k2 = rndInt(1, 8),
		g = rndInt(0, 100),
		args = [q, k1, k2, g];

	automaton.init(function() {
		return rndInt(1, q);
	});
	automaton.rule = AutomatonRule.bz;

	var generators = [];

	function updateGenerators(){

	}

	function loop() {
		render(canvas, w, h, automaton.update(args));
		updateGenerators();
		requestAnimationFrame(loop);
	}
	loop();
}

window.onload = main;