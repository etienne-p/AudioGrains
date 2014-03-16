function main(buffer) {

	var w = window.innerWidth,
		h = window.innerHeight, // so we have 1024 cells
		canvas = document.createElement('canvas');

	canvas.width = w;
	canvas.height = h;
	document.getElementsByTagName('body')[0].appendChild(canvas);

	var particles = Particles.create(30, [], Particles.createParticle.bind(undefined, 0, 0, 0, 0)),
		context = canvas.getContext('2d'),
		mouse = new lib.Mouse(false, window),
		fps = new lib.FPS(),
		friction = 0.6,
		acceleration = 0.1;

	fps.tick.add(function(dt) {
		Particles.render(
			Particles.update(
				particles,
				mouse.position.value.x / w,
				mouse.position.value.y / h,
				acceleration,
				friction),
			context, w, h);
	});

	var audioContext = lib.AudioUtil.getContext(),
		bufferLength = 2048,
		scriptProcessor = audioContext.createScriptProcessor(bufferLength, 0, 2),
		sampler = new lib.SamplePlayer(buffer.getChannelData(0), buffer.getChannelData(1)),
		grainCount = particles.length,
		rate = 0.00001,
		pos = 0,
		pitch = 1,
		paused = true,
		grainLength = (18 / 1000) * 44100, // 20ms
		granulator = new Granulator(sampler, bufferLength);

	window.xxx = scriptProcessor; // prevent buggy garbage collection
	granulator.updateGrains(grainCount, grainLength);
	sampler.amp(0.8);

	// first test: cache a static one
	function getFrame() {
		var i = 0,
			rates = [],
			delays = [],
			p = null,
			posRatios = [];

		for (; i < grainCount; i++) {
			p = particles[i];
			rates[i] = pitch;
			//rates[i] = 1 - (p.y - h * 0.5 / h);
			delays[i] = Math.floor((i / grainCount) * bufferLength);
			posRatios[i] = pos = (pos + rate * p.x) % 1;
			//posRatios[i] = 0.5 + rate * p.x;
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

	// add GUI, dat.gui is designed to operate on public fields
	// to fit with our design, we introduce a mock object
	var gui = new dat.GUI(),
		mock = {
			grainCount: grainCount,
			grainLength: grainLength,
			rate: rate,
			pitch: pitch,
			acceleration: acceleration,
			friction: friction
		};
	gui.add(mock, 'grainCount', 1, 60).onChange(function(newValue) {
		console.log('change');
		audioPlaying(false);
		grainCount = Math.floor(newValue);
		Particles.create(grainCount, particles, Particles.createParticle.bind(undefined, 0, 0, 0, 0)),
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
	gui.add(mock, 'acceleration', 0, 1).onChange(function(newValue) {
		acceleration = newValue;
	});
	gui.add(mock, 'friction', 0, 1).onChange(function(newValue) {
		friction = newValue;
	});

	//...
	function togglePause() {
		paused = !paused;
		fps.enabled(!paused);
		mouse.enabled(!paused);
		audioPlaying(!paused);
	}


	window.addEventListener('click', function() {
		togglePause();
	});

	togglePause();
}

window.onload = function() {
	lib.AudioUtil.loadSample('media/funkpad.wav', main);
};