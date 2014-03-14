lib.SamplePlayer = function(left, right) {

	var pos = 0,
		len = left.length,
		rate = 1,
		amp = 1;

	// interpolation requires accessing samples at potentially Math.ceil((len - 1).546))
	// make sure that this sample exists
	// this way, we don't have to add % len on sample index

	left[len] = left[0];
	right[len] = right[0];

	function processAudio(outBufferL, outBufferR) {

		var bufLen = outBufferL.length,
			alpha = 0; // interpolation

		for (var i = 0; i < bufLen; ++i) {
			alpha = pos - Math.floor(pos);
			outBufferL[i] = amp * 0.5 * (alpha * left[Math.floor(pos)] + (1 - alpha) * left[Math.ceil(pos)]);
			outBufferR[i] = amp * 0.5 * (alpha * right[Math.floor(pos)] + (1 - alpha) * right[Math.ceil(pos)]);
			pos = (len + pos + rate) % len;
		}
	};

	return {
		processAudio: processAudio,
		posRatio: function(arg) {
			if (typeof arg == 'number') pos = arg * len;
			return pos / len;
		},
		rate: function(arg) {
			if (typeof arg == 'number') rate = arg;
			return rate;
		},
		amp: function(arg) {
			if (typeof arg == 'number') amp = arg;
			return amp;
		},
	}

}

//use:
//scriptProcessor.onaudio = SamplePlayer.processAudio