var GLParticlesRenderer = function() {

	// set the scene size
	var self = {},
		width = 400,
		height = 300,
		renderer = null,
		camera = null,
		scene = null,
		geometry = null,
		cr = null;

	// could be externalised
	function updateVertices(vertices_, particles_, audio_) {

		cr.setPoints(particles_);

		var i = 0,
			verticeCount = vertices_.length,
			curvePts = [];

		for (; i < verticeCount; ++i) curvePts[i] = cr.getPointAt(i / verticeCount);

		curvePts = [curvePts[0]].concat(curvePts).concat([curvePts[curvePts.length - 1]]);

		var p = null,
			pDown = null,
			pUp = null,
			finalPts = [],
			angle = 0,
			audioLen = audio_.length,
			mul = 0,
			v = null,
			index = -1;

		for (i = 1; i < verticeCount + 1; ++i) {

			p = curvePts[i];
			pDown = curvePts[i - 1];
			pUp = curvePts[i + 1];

			angle = Math.atan2((pUp.y - pDown.y) * height, (pUp.x - pDown.x) * width) + Math.PI * 0.5;
			mul = audio_[Math.floor(audioLen * (i - 1) / verticeCount)] / 255;

			v = vertices_[i - 1];
			v.x = p.x * width + mul * Math.cos(angle);
			v.y = p.y * height + mul * Math.sin(angle);
		}

		return vertices_;
	}

	self.init = function() {

		cr = new CatmullRom();

		renderer = new THREE.WebGLRenderer();
		camera = new THREE.PerspectiveCamera(75, width / height, 1, 3000);
		scene = new THREE.Scene();

		camera.position.z = 1000;
		scene.add(camera);
		document.getElementById('container').appendChild(renderer.domElement);

		geometry = new THREE.Geometry();
		geometry.verticesNeedUpdate = true;

		// create particle system
		particleSystem = new THREE.ParticleSystem(
			geometry,
			new THREE.ParticleBasicMaterial({
				color: 0xFFFFFF,
				size: 20
			}));
		scene.add(particleSystem);

		return self;
	}

	self.setParticlesCount = function(count) {
		var vertices = [];
		for (var p = 0; p < particlesCount; p++) vertices[i] = new THREE.Vector3();
		geometry.vertices = vertices;
		return self;
	}

	self.resize = function(w, h) {
		renderer.setSize(width = w, height = h);
		camera.aspect = width / height;
		return self;
	}

	self.render = function(particles_, audio_) {
		updateVertices(geometry.vertices, particles_, audio_)
		renderer.render(scene, camera);
		return self;
	}

	return self;
}