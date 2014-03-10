lib.GLUtil = {

	makeShader: function(gl_, source_, type_) {
		var shader = gl_.createShader(type_);
		gl_.shaderSource(shader, source_);
		gl_.compileShader(shader);
		if (!gl_.getShaderParameter(shader, gl_.COMPILE_STATUS)) {
			console.log("Error compiling shader: " + gl_.getShaderInfoLog(shader));
		}
		return shader;
	}

}