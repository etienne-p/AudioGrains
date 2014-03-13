var AudioGenerator = function(audioContext) {
	this._context = audioContext;
	this._oscillator = this._context.createOscillator();
	this._gain = this._context.createGain();
	this._gain.gain.value = 0;
	this._oscillator.connect(this._gain);

	this.cell = null;
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

		var cell = this.cell.state,
			freq = Music.note(cell / 255),
			gain = Math.pow(Math.E, -freq / 12000) * 0.5 * cell / 255;

		this._gain.gain.value = gain;
		this._oscillator.frequency.value =freq;

		this.prevAvrgCell = cell;
	},

	connect: function(arg) {
		this._gain.connect(arg);
	}
}