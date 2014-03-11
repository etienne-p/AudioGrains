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

	var audioContext = lib.AudioUtil.getContext();

	function getCellsRect(x, y, w, h) {
		var rv = [],
			i, j;
		for (i = 0; i < h; ++i) {
			for (j = 0; j < w; ++j) {
				rv[i * w + j] = automaton.getCellAt(x + j, y + i);
			}
		}
		return rv;
	}

	var generators = [],
		merger = audioContext.createChannelMerger(),
		i = 0,
		nGen = 12;
	for (; i < 8; ++i) {
		generators[i] = new AudioGenerator(audioContext);
		generators[i].cells = getCellsRect(i % 4, Math.floor(i % 2), 4, 4);
		generators[i].connect(merger);
		generators[i].start();
	}

	merger.connect(audioContext.destination);

	var fps = new lib.FPS();

	fps.tick.add(function(dt) {
		var i = generators.length
		while (i--) generators[i].update(dt);
		render(canvas, w, h, automaton.update(args));
	});

	fps.enabled(true);

}

window.onload = main;