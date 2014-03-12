function render(canvas, w, h, cells) {
	var side = 20,
		ctx = canvas.getContext('2d'),
		i = 0,
		len = cells.length;

	ctx.clearRect(0, 0, (canvas.width = w * side), (canvas.height = h * side));

	for (i = 0; i < len; ++i) {
		val = cells[i];
		ctx.fillStyle = 'rgb(' + val + ',' + val + ',' + val + ')';
		ctx.fillRect(side * (i % w), 20 + side * Math.floor(i / w), side, side);
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

	var initValues = (function() {
		var i = 0,
			len = w * h,
			rv = [];
		for (; i < len; ++i) rv[i] = rndInt(1, q);
		return rv;
	})();

	// print config to console:
	var cfg = {
		initValues: initValues,
		q: q,
		k1: k1,
		k2: k2,
		g: g
	};
	console.log(JSON.stringify(cfg));

	automaton.init(initValues);
	automaton.rule = AutomatonRule.bz;

	var audioContext = lib.AudioUtil.getContext();

	function getCellsRect(x, y, w, h) {
		var rv = [],
			i, j, cell;
		for (i = 0; i < h; ++i) {
			for (j = 0; j < w; ++j) {
				cell = automaton.getCellAt(x + j, y + i);
				if (cell) rv.push(cell);
				else throw 'failed at retrieving cell, x: [' + (x + j) + '] y: [' + (y + i) + ']'
			}
		}
		return rv;
	}

	var generators = [],
		merger = audioContext.createChannelMerger(),
		i = 0,
		x = 0,
		y = 0;
	for (; i < 8; ++i) {
		generators[i] = new AudioGenerator(audioContext);
		//generators[i].cells = getCellsRect(x = 4 * (i % 4), y = 4 * Math.floor(i / 4), 1, 1);
		generators[i].cell = automaton.getCellAt(x = 4 * (i % 4), y = 4 * Math.floor(i / 4));
		console.log('x: [' + x + '] y: [' + y + ']');
		generators[i].connect(merger);
		generators[i].start();
	}

	merger.connect(audioContext.destination);

	var fps = new lib.FPS(),
		latestCells = automaton.update(args),
		automatonUpdateDelay = 200;

	function updateAutomaton() {
		latestCells = automaton.update(args);
		var i = generators.length
		while (i--) generators[i].update();
		//updateAutomaton(); // uncomment -> browser implodes
		setTimeout(updateAutomaton, automatonUpdateDelay);
	}

	updateAutomaton();

	fps.tick.add(function(dt) {
		render(canvas, w, h, latestCells);
	});

	fps.enabled(true);

}

window.onload = main;