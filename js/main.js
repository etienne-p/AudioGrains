function main(buffer) {

	var particles = Particles.create(8, [], Particles.createParticle.bind(undefined, 0, 0, 0, 0)),
		mouse = new lib.Mouse(false, window),
		fps = new lib.FPS(),
		friction = 0.3,
		w = window.innerWidth,
		h = window.innerHeight,
		renderer = new GLParticlesRenderer().init(1000).resize(w, h),
		acceleration = 0.8;

	var audioContext = lib.AudioUtil.getContext(),
		bufferLength = 4096,
		scriptProcessor = audioContext.createScriptProcessor(bufferLength, 0, 2),
		sampler = new lib.SamplePlayer(buffer.getChannelData(0), buffer.getChannelData(1)),
		grainCount = particles.length,
		paused = true,
		grainLength = 2500, // 20ms
		granulator = new Granulator(sampler, bufferLength),
		audioBuffer = [0];

	fps.tick.add(function(dt) {
		renderer.render(
			Particles.update(
				particles, (mouse.x / w) - 0.5, (mouse.y / h) - 0.5,
				acceleration,
				friction),
			audioBuffer);
	});

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
			rates[i] = 1 - 0.5 * (p.y - h * 0.5 / h);
			delays[i] = Math.floor((i / grainCount) * bufferLength);
			posRatios[i] = Math.max(0, Math.min(1, p.x + 0.5));
		}
		return {
			rates: rates,
			delays: delays,
			posRatios: posRatios
		}
	};

	function processAudio(e) {
		audioBuffer = granulator.processAudio(
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
			acceleration: acceleration,
			friction: friction
		};
	gui.add(mock, 'grainCount', 1, 120).onChange(function(newValue) {
		console.log('change');
		audioPlaying(false);
		grainCount = Math.floor(newValue);
		Particles.create(grainCount, particles, Particles.createParticle.bind(undefined, 0, 0, 0, 0)),
		granulator.updateGrains(grainCount, grainLength);
		audioPlaying(true);
	});
	gui.add(mock, 'grainLength', 10, 4000).onChange(function(newValue) {
		audioPlaying(false);
		grainLength = Math.floor(newValue);
		granulator.updateGrains(grainCount, grainLength);
		audioPlaying(true);
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

	window.addEventListener('resize', function() {
		w = window.innerWidth;
		h = window.innerHeight;
		renderer.resize(w, h);
	});

	togglePause();
}

window.onload = function() {
	lib.AudioUtil.loadSample('media/human.wav', main);
};

function testLeap() {
	// Creating our leap controller
	var controller = new Leap.Controller();

	// Proving that the websocket is open
	controller.on('connect', function() {
		console.log('Successfully connected.');
	});

	// Proving that a device can be connected
	controller.on('deviceConnected', function() {
		console.log('A Leap device has been connected.');
	});

	// And that it can be disconnected
	controller.on('deviceDisconnected', function() {
		console.log('A Leap device has been disconnected.');
	});

	// When the controller is ready, spawn the unicorn!
	controller.on('ready', function() {
		console.log('Controller is ready!');



	});

	controller.connect().on('frame', function(frame) {
		if (frame) {
			console.log(frame);
		}
	});
}