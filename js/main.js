function main(buffer) {

	var particles = Particles.create(6, [], Particles.createParticle.bind(undefined, 0, 0, 0, 0)),
		mouse = new lib.Mouse(false, window),
		fps = new lib.FPS(),
		friction = 0.6,
		w = window.innerWidth, h = window.innerHeight,
		renderer = new GLParticlesRenderer().init().setParticlesCount(600).resize(w, h),
		acceleration = 0.1;

	var audioContext = lib.AudioUtil.getContext(),
		bufferLength = 4096,
		scriptProcessor = audioContext.createScriptProcessor(bufferLength, 0, 2),
		sampler = new lib.SamplePlayer(buffer.getChannelData(0), buffer.getChannelData(1)),
		grainCount = particles.length,
		paused = true,
		grainLength = (18 / 1000) * 44100, // 20ms
		granulator = new Granulator(sampler, bufferLength),
		audioBuffer = [0];

	fps.tick.add(function(dt) {
		renderer.render(
			Particles.update(
				particles,
				mouse.position.value.x / w,
				mouse.position.value.y / h,
				acceleration,
				friction),
			audioBuffer);
	});

	window.xxx = scriptProcessor; // prevent buggy garbage collection
	granulator.updateGrains(grainCount, grainLength);
	sampler.amp(0.2);

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
			posRatios[i] = Math.max(0, Math.min(1, p.x));
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
	// TODO: gui setup code is super repetitive!!!
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

	togglePause();
}

window.onload = function() {
	lib.AudioUtil.loadSample('media/perc.wav', main);
};

function testCatmullRom() {

	var width = window.innerWidth,
		height = window.innerHeight, // so we have 1024 cells
		canvas = document.createElement('canvas'),
		pi2 = Math.PI * 2,
		context = canvas.getContext('2d');

	canvas.width = width;
	canvas.height = height;
	document.getElementsByTagName('body')[0].appendChild(canvas);

	function dotAt(x, y, color, radius) {
		context.fillStyle = color;
		context.beginPath();
		context.arc(x * width, y * height, radius, 0, pi2);
		context.fill();
		//context.closePath();
	}

	var i = 0,
		points = [];
	for (; i < 6; ++i) {
		points[i] = {
			x: Math.random(),
			y: Math.random()
		}
		dotAt(points[i].x, points[i].y, "#FF0000", 5);
	}

	// generate random control points
	var cr = new CatmullRom();
	cr.setPoints(points);

	// draw curve
	var radius = 5,
		t = 0,
		dt = 0.02,
		curvePts = [],
		p = null;

	while (t < 1) {
		curvePts.push(cr.getPointAt(t));
		t += dt;
	}

	curvePts = [curvePts[0]].concat(curvePts).concat([curvePts[curvePts.length - 1]]);

	var len = curvePts.length;

	//how do we eval tan at extremities?

	context.strokeStyle = '#FFFFFF';

	var a = 0,
		pDown = null,
		pUp = null;

	for (i = 1; i < len - 1; ++i) {

		p = curvePts[i];
		dotAt(p.x, p.y, "#FFFFFF", 2);
		// draw tan
		context.moveTo(p.x * width, p.y * height);

		// a depends on 
		pDown = curvePts[i - 1];
		pUp = curvePts[i + 1];

		a = Math.atan2((pUp.y - pDown.y) * height, (pUp.x - pDown.x) * width) + Math.PI * 0.5;
		//a = Math.atan((pUp.y - pDown.y)/(pUp.x - pDown.x))/* + Math.PI * 0.5*/;

		context.lineTo(p.x * width + 30 * Math.cos(a), p.y * height + 30 * Math.sin(a));
		context.stroke();
	}
}