var GLParticlesRenderer = function(canvas) {

	// imports
	var makeShader = lib.GLUtil.makeShader;

	// vars
	var self = {},
		gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl'),
		glProgram = null,
		fragmentShader = null,
		vertexShader = null,
		vertexPositionAttribute = null,
		verticeBuffer = null,
		vertices = null,
		verticeBuffer = null,
		pMatrix = mat4.create(),
		pMatrixUniform = null,
		mvMatrix = mat4.create(),
		mvMatrixUniform = null;

	//-- Helpers
	function glClear() {
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
	}

	function getMatrixUniforms() {
		pMatrixUniform = gl.getUniformLocation(glProgram, "uPMatrix");
		mvMatrixUniform = gl.getUniformLocation(glProgram, "uMVMatrix");
	}

	function setMatrixUniforms() {
		gl.uniformMatrix4fv(pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(mvMatrixUniform, false, mvMatrix);
	}

	//...
	function initShaders() {
		vertexShader = makeShader(gl, document.getElementById('shader-vs').innerHTML, gl.VERTEX_SHADER);
		fragmentShader = makeShader(gl, document.getElementById('shader-fs').innerHTML, gl.FRAGMENT_SHADER);
		glProgram = gl.createProgram();
		gl.attachShader(glProgram, vertexShader);
		gl.attachShader(glProgram, fragmentShader);
		gl.linkProgram(glProgram);
		gl.useProgram(glProgram);
	}

	function initVertices(numVertices_) {
		vertices = new Float32Array(numVertices_ * 3),
		verticeBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, verticeBuffer);
		vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
		gl.enableVertexAttribArray(vertexPositionAttribute);
		gl.bindBuffer(gl.ARRAY_BUFFER, verticeBuffer);
		gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	}

	//-- Public
	self.init = function() {
		glClear();
		initShaders();
		getMatrixUniforms();
	}

	self.update = function(particles) {

		
		// TODO: appens once, shoud NOT check every time
		/*if (!vertices) {
			initVertices(numVertices)
		}

		for (i = 0; i < len; ++i) {
			
			// bottom left
			vertices[++vertexIndex] = radMin * cosmin;
			vertices[++vertexIndex] = radMin * sinmin;
			vertices[++vertexIndex] = 0; // z
		}

		// using gl.DYNAMIC_DRAW instead of STATIC_DRAW doesn't seem to make a difference...
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
		gl.drawArrays(gl.TRIANGLES, 0, len * 6);*/
	}

	self.resize = function(w_, h_) {
		canvas.width = w_;
		canvas.height = h_;
		gl.viewport(0, 0, canvas.width, canvas.height);
		mat4.perspective(pMatrix, Math.PI * 0.25, canvas.width / canvas.height, 0.1, 100.0);
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, mvMatrix, [0, 0, -2]);
		setMatrixUniforms();
	}

	return self;
}