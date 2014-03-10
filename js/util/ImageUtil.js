lib.ImageUtil = {

	loadImage: function(url, callBack) {
		var objImage = new Image();
		objImage.src = url;
		if (objImage.complete == true) {
			callBack.call(null, objImage);
		} else {
			objImage.onload = function() {
				callBack.call(null, objImage);
			};
		}
	},

	extractImageData: function(image) {

		//-- 
		var canvas = ImageUtil.__canvas = ImageUtil.__canvas === undefined ? document.createElement("canvas") : ImageUtil.__canvas;
		var context2D = canvas.getContext("2d");

		canvas.width = image.width;
		canvas.height = image.height;

		context2D.drawImage(image, 0, 0);
		return context2D.getImageData(0, 0, image.width, image.height)
	}
}