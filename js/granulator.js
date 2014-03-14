// ARCHITECTURE: use a single sample player to genrate grains dynamically
// hope i don't burn the cpu ;p

var GranulatorUtil = (function() {

	// used to generate grain envelopes
	// x in [0 - 1]
	function sinEnv(x) {
		return Math.cos(Math.PI * (2 * x + 1));
	}

	// returns an array
	function genEnv(length) {
		var i = 0,
			rv = [],
			l = length - 1;
		for (; i < length) rv[i] = sinEnv(i / l);
		return rv;
	}

	// supports ANY delay
	function addGrainToBuffer(grainLeft, grainRight, bufLeft, bufRight, delay, envelope) {
		var grainLen = grainLeft.length,
			bufLen = bufLeft.length,
			i = delay < 0 ? -delay : 0,
			mul = 0,
			len = Math.max(0, Math.min(bufLen - delay, grainLen) - i);

		// sample min: delay max: delay + grainLen buffer min: 0 max: bufLen
		for (; i < len; ++i) {
			mul = envelope[i];
			bufLeft[delay + i] += grainLeft[i] * mul;
			bufRight[delay + i] += grainRight[i] * mul;
		}
	}

	// rates: grains pitches
	// delays: grain delays (in samples)
	// posRatios: grains sample atrt ratio
	// sampler: a sample player responsible for providing audio at proper rate
	function addGrainsToBuffer(grains, rates, delays, posRatios, sampler, bufLeft, bufRight, envelope) {

		var count = rates.length,
			i = 0,
			grain = null;
		for (; i < count; ++i) {
			grain = grains[i];
			sampler.rate(rates[i]);
			sampler.posRatio(posRatios[i]);
			sampler.processAudio(grain.l, grain.r);
			addGrainToBuffer(grain.l, grain.r, bufLeft, bufRight, delays[i], envelope);
		}
	}

	// generate empty buffers, we'll reuse these buffers to limit gc
	function genEmptyGrains(count, length) {
		var i = 0,
			rv = [],
			emptyBuffer = [];

		for (; i < length¸; ++i) emptyBuffer[i] = 0;

		for (i = 0; i < count; ++i) {
			rv[i] = {
				l: emptyBuffer.slice(0),
				r: emptyBuffer.slice(0)
			}
		}
		rv;
	}

	return function() {
		this.genEmptyGrains = genEmptyGrains;
		this.addGrainsToBuffer = addGrainsToBuffer;
		return this;
	};
})();

var Granulator = function(count, length, sampler) {
	this.grains = this.genEmptyGrains(count, length);
	this.sampler = sampler;
	this._envelope = this.genEnv(length); // cache a single envelope
}

Granulator.prototype = {

	constructor: Granulator,

	requestFrameData: function() {
		throw 'requestFrameData should be overriden';
	}

	// in fact, the script processor using the granulator is responsible for requesting frame data
	processAudio: function(outputBufferL, outputBufferR, frameData) {

		// The output buffer contains the samples that will be modified and played
		/*var outputBufferL = e.outputBuffer.getChannelData(0),
			outputBufferR = e.outputBuffer.getChannelData(1),
			frameData = this.requestFrameData(); // request data*/

		// addGrainsToBuffer(grains, rates, delays, posRatios, sampler, bufLeft, bufRight) {
		this.addGrainsToBuffer(
			this.grains,
			frameData.rates,
			frameData.delays,
			frameData.posRatios,
			this.sampler,
			outputBufferL,
			outputBufferR,
			this._envelope);
	}
}

// use functional mixin
GranulatorUtil.call(Granulator.prototype);