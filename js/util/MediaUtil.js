lib.MediaUtil = {

	//-- select the more appropriate source
	//-- return true if a compatible source was found, false otherwise
	assignSource: function(media, sources) {
		var i = sources.length,
			maybe = [],
			resp = '';

		while (i--) {
			resp = media.canPlayType(sources[i].type);
			Logger.log('type: ' + sources[i].type + 'resp: ' + resp);
			if (resp == 'probably') {
				media.src = sources[i].src;
				return true;
			} else if (resp == 'maybe') {
				maybe.push(sources[i].src);
			}
		}
		if (maybe.length > 0) {
			i = maybe.length;
			//-- prefer .mp4 & .mp3 where available
			while (i--) {
				if (maybe[i].match('.mp')) {
					media.src = maybe[i];
					return true;
				}
			}
			media.src = maybe[0];
			return true;
		}
		return false;
	}

}