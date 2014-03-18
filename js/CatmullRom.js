var CatmullRom = function(points_) {

	var sym = lib.GeomUtil.getSymmetric,
		points = null,
		nPts = 0;

	function spline(p0, p1, p2, p3, t) {
		return {
			x: 0.5 * ((2 * p1.x) +
				t * ((-p0.x + p2.x) +
					t * ((2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) +
						t * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x)))),
			y: 0.5 * ((2 * p1.y) +
				t * ((-p0.y + p2.y) +
					t * ((2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) +
						t * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y))))
		};
	}

	function getSegmentPointAt(index, t) {
		return spline(points[index - 1], points[index], points[index + 1], points[index + 2], t);
	}

	function getPointAt(t) {
		var lt = (nPts - 1) * t;
		return getSegmentPointAt(
			Math.min(Math.floor(lt) + 1, nPts - 1), 
			t - Math.floor(lt));
	}

	function setPoints(points_){
		points = [sym(points_[1], points_[0])]
			.concat(points_)
			.concat([sym(points_[points_.length - 2], points_[points_.length - 1])]),
		nPts = points.length - 2;
	}

	return {
		setPoints: setPoints,
		getPointAt: getPointAt
	}
}