var AudioGenerator = function(audioContext) {
	this._context = audioContext;
	this._oscillator = this._context.createOscillator();
	this._gain = this._context.createGain();
	this._gain.gain.value = 0;
	this._oscillator.connect(this._gain);

	this.cells = null;
	this.prevAvrgCell = 0;
	this.grainDuration = 50; // ms
}

AudioGenerator.prototype = {

	constructor: AudioGenerator,

	start: function() {
		this._oscillator.start(0);
	},

	// update audio nodes depending on cells
	update: function(dt) {

		var i = 0,
			len = this.cells.length,
			avrgCell = 0;
		for (; i < len; ++i) avrgCell += this.cells[i].state; // evaluate average stateCell
		avrgCell /= 1 + len;

		var now = this._context.currentTime,
			gain = 0.5 * avrgCell / 255,
			freq = 50 + 10000 * avrgCell / 255,
			delay = now + dt * 0.5 / 1000;
		//this._gain.gain.cancelScheduledValues(now); useful?
		this._gain.gain.linearRampToValueAtTime(gain, delay);
		this._oscillator.frequency.linearRampToValueAtTime(freq, delay);

		this.prevAvrgCell = avrgCell;
	},

	connect: function(arg) {
		this._gain.connect(arg);
	}
}