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
	function updateVertices(positions, particles, audio) {

		cr.setPoints(particles);

		var i = 0,
			verticeCount = positions.length / 3,
			curvePts = [];

		for (; i < verticeCount; ++i) curvePts[i] = cr.getPointAt(i / verticeCount);

		curvePts = [curvePts[0]].concat(curvePts).concat([curvePts[curvePts.length - 1]]);

		var p = null,
			pDown = null,
			pUp = null,
			finalPts = [],
			angle = 0,
			audioLen = audio.length,
			mul = 0,
			v = null,
			ratio = 0,
			index = -1;

		for (i = 1; i < verticeCount + 1; ++i) {

			p = curvePts[i];
			pDown = curvePts[i - 1];
			pUp = curvePts[i + 1];

			angle = Math.atan2((pUp.y - pDown.y) * height, (pUp.x - pDown.x) * width) + Math.PI * 0.5;
			ratio = (i - 1) / verticeCount;
			mul = (1 - ratio) * audio[Math.floor(audioLen * ratio)];

			positions[(i - 1) * 3] = -((p.x - 0.5) * 2 + mul * Math.cos(angle)) * width;
			positions[(i - 1) * 3 + 1] = -((p.y - 0.5) * 2 + mul * Math.sin(angle)) * height;
			positions[(i - 1) * 3 + 2] = 500;
		}

		return positions;
	}

	self.init = function() {

		cr = new CatmullRom();

		renderer = new THREE.WebGLRenderer();
		camera = new THREE.PerspectiveCamera(90, width / height, 1, 3000);
		scene = new THREE.Scene();

		camera.z = -500;
		camera.lookAt(new THREE.Vector3(0, 0, 1));

		scene.add(camera);
		document.getElementById('container').appendChild(renderer.domElement);

		geometry = new THREE.BufferGeometry();
		geometry.addAttribute('position', Float32Array, 1000, 3); //600 segments
		//geometry.dynamic = true; //TODO: check perf impact

		// create particle system
		particleSystem = new THREE.Line(
			geometry,
			new THREE.LineBasicMaterial());
		scene.add(particleSystem);

		return self;
	}

	self.setParticlesCount = function(count) {
		/*var vertices = [];
		for (var i = 0; i < count; ++i) vertices[i] = new THREE.Vector3();
		geometry.vertices = vertices;*/
		return self;
	}

	self.resize = function(w, h) {
		renderer.setSize(width = w, height = h);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		return self;
	}

	self.render = function(particles, audio) {
		updateVertices(geometry.attributes.position.array, particles, audio);
		geometry.attributes.position.needsUpdate = true;
		renderer.render(scene, camera);
		return self;
	}

	return self;
}