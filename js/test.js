function testCatmullRom() {

	var width = window.innerWidth,
		height = window.innerHeight, // so we have 1024 cells
		canvas = document.createElement('canvas'),
		pi2 = Math.PI * 2,
		context = canvas.getContext('2d');

	canvas.width = width;
	canvas.height = height;
	document.getElementsByTagName('body')[0].appendChild(canvas);

	function dotAt(x, y, color, radius) {
		context.fillStyle = color;
		context.beginPath();
		context.arc(x * width, y * height, radius, 0, pi2);
		context.fill();
		//context.closePath();
	}

	var i = 0,
		points = [];
	for (; i < 6; ++i) {
		points[i] = {
			x: Math.random(),
			y: Math.random()
		}
		dotAt(points[i].x, points[i].y, "#FF0000", 5);
	}

	// generate random control points
	var cr = new CatmullRom();
	cr.setPoints(points);

	// draw curve
	var radius = 5,
		t = 0,
		dt = 0.02,
		curvePts = [],
		p = null;

	while (t < 1) {
		curvePts.push(cr.getPointAt(t));
		t += dt;
	}

	curvePts = [curvePts[0]].concat(curvePts).concat([curvePts[curvePts.length - 1]]);

	var len = curvePts.length;

	//how do we eval tan at extremities?

	context.strokeStyle = '#FFFFFF';

	var a = 0,
		pDown = null,
		pUp = null;

	for (i = 1; i < len - 1; ++i) {

		p = curvePts[i];
		dotAt(p.x, p.y, "#FFFFFF", 2);
		// draw tan
		context.moveTo(p.x * width, p.y * height);

		// a depends on 
		pDown = curvePts[i - 1];
		pUp = curvePts[i + 1];

		a = Math.atan2((pUp.y - pDown.y) * height, (pUp.x - pDown.x) * width) + Math.PI * 0.5;
		//a = Math.atan((pUp.y - pDown.y)/(pUp.x - pDown.x))/* + Math.PI * 0.5*/;

		context.lineTo(p.x * width + 30 * Math.cos(a), p.y * height + 30 * Math.sin(a));
		context.stroke();
	}
}