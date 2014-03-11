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

	AudioGenerator.constructor: AudioGenerator,

	// update audio nodes depending on cells
	update: function() {

		var i = 0,
			len = this.cells.length,
			avrgCell = 0;
		for (; i < len; ++i) avrgCell += this.cells[i].state; // evaluate average stateCell

		var now = this._context.currentTime,
			gain = 0,
			freq = 0;
		//this._gain.gain.cancelScheduledValues(now); useful?
		this._gain.gain.linearRampToValueAtTime(gain, now + this.grainDuration);
		this._oscillator.frequency.linearRampToValueAtTime(freq, now + this.grainDuration);

		this.prevAvrgCell = avrgCell;
	}

	connect: function(arg) {
		this._gain.connect(arg);
	}
}