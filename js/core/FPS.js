lib.FPS = function() {

	var paused = true,
		self = {},
		time = 0,
		tick = new lib.Signal(),
		pausedS = new lib.Signal(),
		resumedS = new lib.Signal();

	function loop() {
		if (paused) return;
		var now = Date.now();
		tick.dispatch(now - time);
		time = now;
		requestAnimationFrame(loop);
	}

	self.enabled = function(val) {
		var val = val ? true : false;
		if (paused == !val) return;
		if (val) {
			time = Date.now();
			paused = false;
			resumedS.dispatch();
			loop();
		} else {
			paused = true;
			pausedS.dispatch();
		}
	}

	self.tick = tick;
	self.paused = pausedS; // TODO: better...
	self.resumed = resumedS;

	return self;
}