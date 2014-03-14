// ARCHITECTURE: use a single sample player to genrate grains dynamically
// hope i don't burn the cpu ;p

var GranulatorUtil = (function() {

	// used to generate grain envelopes
	// x in [0 - 1]
	function sinEnv(x) {
		return 0.5 * (1 + Math.cos(Math.PI * (2 * x + 1)));
	}

	/*function gaussianEnv(x){
		var b = 0.5, c = 0.12;
		return Math.exp(- (x - b) * (x - b) / (2 * c * c))
	}*/

	// returns an array
	function genEnv(length) {
		var i = 0,
			rv = [],
			l = length - 1;
		for (; i < length; ++i) rv[i] = sinEnv(i / l);
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

		for (; i < length; ++i) emptyBuffer[i] = 0;

		for (i = 0; i < count; ++i) {
			rv[i] = {
				l: emptyBuffer.slice(0),
				r: emptyBuffer.slice(0)
			}
		}
		return rv;
	}

	return function() {
		this.genEnv = genEnv;
		this.genEmptyGrains = genEmptyGrains;
		this.addGrainsToBuffer = addGrainsToBuffer;
		return this;
	};
})();

var Granulator = function(sampler) {
	this.sampler = sampler;
}

Granulator.prototype = {

	constructor: Granulator,

	updateGrains: function(count, length) {
		this.grains = this.genEmptyGrains(count, length);
		this._envelope = this.genEnv(length); // cache a single envelope
	},

	requestFrameData: function() {
		throw 'requestFrameData should be overriden';
	},

	// in fact, the script processor using the granulator is responsible for requesting frame data
	processAudio: function(outputBufferL, outputBufferR, frameData) {

		// TODO: CHROME ISSUE: buffer seems to be reused, and needs exploicit reset
		var i = 0; len = outputBufferL.length;
		for (; i < len; ++i) outputBufferL[i] = outputBufferR[i] = 0;
		
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