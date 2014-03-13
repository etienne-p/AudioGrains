// helpers
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

function getCellsRect(automaton, x, y, w, h) {
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

function rndInt(min, max) {
	return Math.floor(min + (max - min) * Math.random());
}

function setupAutomaton(w, h) {

	var automaton = new Automaton(w, h);

	var q = rndInt(2, 255),
		k1 = rndInt(1, 8),
		k2 = rndInt(1, 8),
		g = rndInt(0, 100);

	// TODO: HACK
	window.args = [q, k1, k2, g];

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
	return automaton;
}

function addSamplePlayer(audioContext, lBuf, rBuf, destination) {
	var samplePlayer = new lib.SamplePlayer(lBuf, rBuf),
		scriptProcessor = audioContext.createScriptProcessor(1024, 0, 2);

	scriptProcessor.onaudioprocess = samplePlayer.processAudio;
	scriptProcessor.connect(destination);

	// store to workaround buggy garbage collection
	(window.scriptProcessors = window.scriptProcessors || []).push(scriptProcessor);

	return samplePlayer;
}


function main(buffer) {

	var w = 4 * 4,
		h = 4 * 2, // so we have 1024 cells
		canvas = document.createElement('canvas');
	document.getElementsByTagName('body')[0].appendChild(canvas);

	var automaton = setupAutomaton(w, h),
		audioContext = lib.AudioUtil.getContext(),
		merger = audioContext.createChannelMerger(),
		lBuf = buffer.getChannelData(0),
		rBuf = buffer.getChannelData(1),
		latestCells = null,
		sp = addSamplePlayer(audioContext, lBuf, rBuf, merger);

	merger.connect(audioContext.destination);
	// add audio

	function updateAutomaton() {
		latestCells = automaton.update(window.args);
		var cell = latestCells[0];
		//sp.setAmp(cell / 255);
		sp.setRate(1 + 2 * (cell / 255 - 0.5));
		setTimeout(updateAutomaton, 30);
	};

	// add UI animation
	var fps = new lib.FPS();
	fps.tick.add(function(dt) {
		render(canvas, w, h, latestCells);
	});

	updateAutomaton();
	fps.enabled(true);
}

window.onload = function() {
	lib.AudioUtil.loadSample('media/loop.wav', main);
};