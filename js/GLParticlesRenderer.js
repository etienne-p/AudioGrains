var GLParticlesRenderer = function() {

	// set the scene size
	var WIDTH = 400,
		HEIGHT = 300;

	// set some camera attributes
	var VIEW_ANGLE = 45,
		ASPECT = WIDTH / HEIGHT,
		NEAR = 0.1,
		FAR = 10000;

	// create a WebGL renderer, camera
	// and a scene
	var renderer = new THREE.WebGLRenderer();
	var camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 1, 3000);
	camera.position.z = 1000;

	var scene = new THREE.Scene();

	// add the camera to the scene
	scene.add(camera);

	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	document.getElementById('container').appendChild(renderer.domElement);

	var particleCount = 1800,
		particles = new THREE.Geometry(),
		pMaterial = new THREE.ParticleBasicMaterial({
			color: 0xFFFFFF,
			size: 20
		});

	// now create the individual particles
	for (var p = 0; p < particleCount; p++) {

		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 2000 - 1000;
		vertex.y = Math.random() * 2000 - 1000;
		vertex.z = Math.random() * 2000 - 1000;

		particles.vertices.push(vertex);
	}

	// create the particle system
	var particleSystem = new THREE.ParticleSystem(
		particles,
		pMaterial);

	// add it to the scene
	scene.add(particleSystem);

	renderer.render( scene, camera );


}