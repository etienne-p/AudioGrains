lib.DSPUtil = {

	lowpass: function(input, alpha) {
		var output = [input[0]],
			i = 1,
			len = input.length;
		for (; i < len; ++i) output[i] = output[i - 1] + alpha * (input[i] - output[i - 1])
		return output;
	},

	envelopDetect: function(input, attack, release, sampleRate) {

		/*
		imagine if you were doing it with a pen
		low pass, detect peaks, join peaks, simplify (douglas peucker)

		//attack and release in milliseconds
		float ga = (float) exp(-1/(SampleRate*attack));
		float gr = (float) exp(-1/(SampleRate*release));

		float envelope=0;

		for(...)
		{
		  //get your data into 'input'
		  EnvIn = abs(input);

		  if(envelope < EnvIn)
		  {
		     envelope *= ga;
		     envelope += (1-ga)*EnvIn;
		  }
		  else
		  {
		     envelope *= gr;
		     envelope += (1-gr)*EnvIn;
		  }
		  //envelope now contains.........the envelope ;)
		}
		*/

		var i = 1,
			len = input.length,
			filtered = lib.DSPUtil.lowpass(input, alpha),
			output = [filtered[0]],
			prev = 0, // previous sample
			d = 0, // sample variation 
			prevCurve = 0;
		for (; i < len; ++i) {
			d = filtered[i] - prev;

			prev = filtered[i];
		}
		return output;
	}
}