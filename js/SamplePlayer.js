lib.SamplePlayer = function(left, right) {

	var pos = 0,
		len = left.length,
		rate = 1,
		amp = 1,
		cRate = 1;

	// interpolation requires accessing samples at potentially Math.ceil((len - 1).546))
	// make sure that this sample exists
	// this way, we don't have to add % len on sample index

	left[len] = left[0];
	right[len] = right[0];

	function processAudio(e) {

		var outBufferL = e.outputBuffer.getChannelData(0),
			outBufferR = e.outputBuffer.getChannelData(1),
			bufLen = outBufferL.length,
			l, r,
			alpha = 0; // interpolation

		for (var i = 0; i < bufLen; ++i) {
			alpha = pos - Math.floor(pos);
			outBufferL[i] = l = amp * 0.5 * (alpha * left[Math.floor(pos)] + (1 - alpha) * left[Math.ceil(pos)]);
			outBufferR[i] = r = amp * 0.5 * (alpha * right[Math.floor(pos)] + (1 - alpha) * right[Math.ceil(pos)]);
			pos = (len + pos + ((rate - cRate) * (i / bufLen) + cRate)) % len;
		}
		cRate = rate;
	};

	return {
		processAudio: processAudio,
		posRatio: function() {
			return pos / len;
		},
		setRate: function(arg) {
			return rate = arg;
		},
		setAmp: function(arg) {
			return amp = arg;
		},
	}

}

//use:
//scriptProcessor.onaudio = SamplePlayer.processAudio