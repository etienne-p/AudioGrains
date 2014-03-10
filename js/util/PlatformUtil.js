lib.PlatformUtil = {

	isMobile: function() {
		var ua = navigator.userAgent;
		var match = (ua.match(/Android/i) || ua.match(/webOS/i) || ua.match(/iPhone/i) || ua.match(/iPad/i) || ua.match(/iPod/i) || ua.match(/BlackBerry/i) || ua.match(/Windows Phone/i))
		return match ? true : false;
	}
}