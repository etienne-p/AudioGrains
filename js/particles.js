var Particles = (function() {

	// createParticle0 = createParticle.bind(....);
	function createParticle(x, y, vx, vy) {
		return {
			x: x,
			y: y,
			vx: vx,
			vy: vy
		};
	}

	// add / remove [count] particles to particles array
	// initParticle: method to create a particle
	function create(count, particles, initParticle) {
		
		var d = count - particles.length,
			i = 0;
		if (d > 0) for (; i < d; ++i) particles.push(initParticle.call());
		else particles.splice(0, -d);

		// TODO TMP
		if (count != particles.length) 
			throw 'Particles create: unexpected particles count, count: [' + count + '] length: [' + particles.length + ']'
		return particles;
	}

	// update particles
	function update(particles, attractorX, attractorY, friction) {
		var i = 0,
			p = null,
			len = particles.length;
		for (; i < len; ++i) {
			p = particles[i];
			p.vx += 0.1 * (attractorX - p.x);
			p.vy += 0.1 * (attractorY - p.y);
			p.vx *= friction;
			p.vy *= friction;
			p.x += p.vx;
			p.y += p.vy;
			attractorX = p.x;
			attractorY = p.y;
		}
		return particles;
	}

	// draw on canvas
	function render(particles, context, width, height) {
		context.clearRect(0, 0, width, height);
		var i = 0,
			len = particles.length,
			p = null,
			pi2 = 2 * Math.PI;

		context.fillStyle = '#ff0000';
		context.strokeStyle = '#ff0000';

		for (; i < len; ++i) {
			context.beginPath();
			p = particles[i];
			context.arc(p.x * width, p.y * height, 4, 0, pi2);
			context.fill();
		}
	}

	return {
		createParticle: createParticle,
		create: create,
		update: update,
		render: render
	}
})();