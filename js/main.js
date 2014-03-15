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

	k1 = 2;
	k2 = 7;
	g = 20;

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

function main(buffer) {

	var w = 4 * 4,
		h = 4 * 2, // so we have 1024 cells
		canvas = document.createElement('canvas');
	document.getElementsByTagName('body')[0].appendChild(canvas);

	var audioContext = lib.AudioUtil.getContext(),
		bufferLength = 2048,
		scriptProcessor = audioContext.createScriptProcessor(bufferLength, 0, 2),
		sampler = new lib.SamplePlayer(buffer.getChannelData(0), buffer.getChannelData(1)),
		grainCount = 4,
		rate = 0.0001,
		pos = 0,
		pitch = 1,
		paused = true,
		grainLength = (18 / 1000) * 44100, // 20ms
		granulator = new Granulator(sampler);

	window.xxx = scriptProcessor; // prevent buggy garbage collection
	granulator.updateGrains(grainCount, grainLength);
	sampler.amp(0.8);

	// first test: cache a static one
	function getFrame() {
		var i = 0,
			rates = [],
			delays = [],
			posRatios = [];
		for (; i < grainCount; i++) {
			rates[i] = pitch;
			delays[i] = Math.floor((i / grainCount) * bufferLength);
			posRatios[i] = pos = (pos + rate) % 1;
		}
		return {
			rates: rates,
			delays: delays,
			posRatios: posRatios
		}
	};

	function processAudio(e) {
		// TODO: should return the portion of the frame that isn't completely played = partially future grains!
		granulator.processAudio(
			e.outputBuffer.getChannelData(0),
			e.outputBuffer.getChannelData(1),
			getFrame());
	};

	scriptProcessor.onaudioprocess = processAudio;

	function audioPlaying(val) {
		if (val) scriptProcessor.connect(audioContext.destination);
		else scriptProcessor.disconnect(audioContext.destination);
	}

	// add UI animation
	/*var fps = new lib.FPS();
	fps.tick.add(function(dt) {
		render(canvas, w, h, latestCells);
	});*/

	// add GUI, dat.gui is designed to operate on public fields
	// to fit with our design, we introduce a mock object
	var gui = new dat.GUI(),
		mock = {
			grainCount: grainCount,
			grainLength: grainLength,
			rate: rate,
			pitch: pitch
		};
	gui.add(mock, 'grainCount', 1, 60).onChange(function(newValue) {
		console.log('change');
		audioPlaying(false);
		grainCount = Math.floor(newValue);
		granulator.updateGrains(grainCount, grainLength);
		audioPlaying(true);
	});
	gui.add(mock, 'grainLength', 10, 1000).onChange(function(newValue) {
		audioPlaying(false);
		grainLength = Math.floor(newValue);
		granulator.updateGrains(grainCount, grainLength);
		audioPlaying(true);
	});
	gui.add(mock, 'rate', rate * 0.1, rate * 10).onChange(function(newValue) {
		rate = newValue;
	});
	gui.add(mock, 'pitch', 0.5, 4).onChange(function(newValue) {
		pitch = newValue;
	});

	//...
	function togglePause() {
		paused = !paused;
		//fps.enabled(!paused);
		audioPlaying(!paused);
	}


	window.addEventListener('click', function(){
		togglePause();
	});

	togglePause();
}

window.onload = function() {
	lib.AudioUtil.loadSample('media/funkpad.wav', main);
};