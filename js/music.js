var Music = (function() {

	var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

	function genScale(freqA) {
		var i = 0,
			len = 12,
			rv = [];
		for (; i < len; ++i) rv[i] = freqA * Math.pow(2, i / 12);
		return rv;
	}

	function genScales(baseFreq, numOctaves) {
		var rv = [],
			i = 0,
			len = numOctaves,
			freq = baseFreq;
		for (; i < len; ++i) {
			rv = rv.concat(genScale(freq));
			freq *= 2;
		}
		return rv;
	}

	/* map [0 - 1] values to N octaves */
	function getValAtRatio(ratio, values) {
		return values[Math.floor(Math.max(0, Math.min(ratio, 1)) * (values.length - 1))];
	}

	var f = genScales(220, 2);

	return {
		note: function(ratio) {
			return getValAtRatio(ratio, f);
		}
	};

})();