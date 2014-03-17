lib.AudioUtil = {

	getContext: function() {
		var rv = null;
		if ('webkitAudioContext' in window) {
			rv = new webkitAudioContext();
		} else if ('AudioContext' in window) {
			rv = new AudioContext();
		}
		lib.AudioUtil.getContext = function() {
			return rv;
		}
		return rv;
	},

	loadSample: function(url_, callback_) {
		var req = new XMLHttpRequest(),
			onError = function() {
				alert('decodeAudioData failed!');
			},
			loadCompleteHandler = function() {
				lib.AudioUtil.getContext().decodeAudioData(req.response, callback_, onError);
			};
		req.open('GET', url_, true);
		req.responseType = 'arraybuffer';
		req.addEventListener('load', loadCompleteHandler, false);
		req.send();
	}
}