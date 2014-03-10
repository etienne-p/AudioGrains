lib.FPS = function() {

	var paused = true,
		self = {},
		time = 0,
		tick = new TTable.Signal(),
		paused = new TTable.Signal(),
		resumed = new TTable.Signal();

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
			resumed.dispatch();
			loop();
		} else {
			paused = true;
			paused.dispatch();
		}
	}

	self.tick = tick;
	self.paused = paused;
	self.resumed = resumed;

	return self;
}