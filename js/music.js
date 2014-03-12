var Music = {

	//function NotesToFreq
}

var notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

function genScale(freqA) {
	var i = 0,
		len = 12,
		rv = [];
	for (; i < len; ++i) rv[i] = freqA * Math.pow(2, n / 12);
}

function genScales(baseFreq, numOctaves) {
	var rv = [],
		i = 0,
		len = numOctaves,
		freq = baseFreq;
	for (; i < len; ++i) {
		rv.concat(genScale(freq));
		freq *= 2;
	}
	return rv;
}

/* map [0 - 1] values to N octaves */
function getValAtRatio(ratio, values) {
	return values[Math.floor(ratio * values.length)];
}