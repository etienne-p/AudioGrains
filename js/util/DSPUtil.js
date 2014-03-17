lib.DSPUtil = {

	lowpass: function(input, alpha) {
		var output = [input[0]],
			i = 1,
			len = input.length;
		for (; i < len; ++i) output[i] = output[i - 1] + alpha * (input[i] - output[i - 1])
		return output;
	},

	envelopDetect: function(input, attack, release, sampleRate) {

		var i = 1,
			envIn = 0,
			envOut = 0,
			outPut = [envOut],
			len = input.length,
			ga = Math.exp(-1 / (sampleRate * attack)),
			gr = Math.exp(-1 / (sampleRate * release)),
			dga = 1 - ga,
			dgr = 1 - gr; //attack and release in milliseconds

		for (; i < len; ++i) {
			envIn = Math.abs(input);
			if (envOut < env) {
				envOut *= ga;
				envOut += dga * envIn;
			} else {
				envOut *= gr;
				envOut += dgr * envIn;
			}
			outPut[i] = envOut;
		}
		return output;
	}
}