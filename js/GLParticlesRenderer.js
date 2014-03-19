var GLParticlesRenderer = function() {
	this.width = 400;
	this.height = 300;
	this.renderer = null;
	this.camera = null;
	this.scene = null;
	this.geometry = null;
	this.cr = null;
}

GLParticlesRenderer.prototype = {

	constructor: GLParticlesRenderer,

	init: function(particleCount) {

		this.cr = new CatmullRom();

		this.renderer = new THREE.WebGLRenderer();
		this.camera = new THREE.OrthographicCamera(
			this.width / -2,
			this.width / 2,
			this.height / 2,
			this.height / -2, 1, 1000);
		this.scene = new THREE.Scene();

		this.camera.z = -500;
		this.camera.lookAt(new THREE.Vector3(0, 0, 1));

		this.scene.add(this.camera);
		document.getElementById('container').appendChild(this.renderer.domElement);

		this.geometry = new THREE.BufferGeometry();
		this.geometry.addAttribute('position', Float32Array, particleCount, 3);
		this.geometry.dynamic = true;

		this.line = new THREE.Line(
			this.geometry,
			new THREE.LineBasicMaterial());
		this.scene.add(this.line);

		return this;
	},

	resize: function(w, h) {
		this.renderer.setSize(this.width = w, this.height = h);
		this.camera.left = this.width / -2;
		this.camera.right = this.width / 2;
		this.camera.top = this.height / 2;
		this.camera.bottom = this.height / -2;
		this.camera.updateProjectionMatrix();
		return this;
	},

	render: function(particles, audio){
		this.updateVertices(this.geometry.attributes.position.array, particles, audio);
		this.geometry.attributes.position.needsUpdate = true;
		this.renderer.render(this.scene, this.camera);
		return this;
	},

	updateVertices: function(positions, particles, audio) {

		this.cr.setPoints(particles);

		var i = 0,
			verticeCount = Math.floor(positions.length / 3),
			curvePts = [];

		for (; i < verticeCount; ++i) curvePts[i] = this.cr.getPointAt(i / verticeCount);

		curvePts = [curvePts[0]].concat(curvePts).concat([curvePts[curvePts.length - 1]]);

		var p = null,
			pDown = null,
			pUp = null,
			angle = 0,
			audioLen = audio.length,
			mul = 0,
			ratio = 0,
			index = -1;

		for (i = 1; i < verticeCount + 1; ++i) {

			p = curvePts[i];
			pDown = curvePts[i - 1];
			pUp = curvePts[i + 1];

			angle = Math.atan2((pUp.y - pDown.y) * this.height, (pUp.x - pDown.x) * this.width) + Math.PI * 0.5;
			ratio = (i - 1) / verticeCount;
			mul = (1 - ratio) * audio[Math.floor(audioLen * ratio)];

			positions[++index] = -((p.x - 0.5) * 2 + mul * Math.cos(angle)) * this.width;
			positions[++index] = -((p.y - 0.5) * 2 + mul * Math.sin(angle)) * this.height;
			positions[++index] = 500;
		}

		return positions;
	}
}