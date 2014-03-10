// automaton is responsible for applying rules on cells,
// exposing cell states, but not rendering them

function genCells(height_, width_) {

	// init cells
	var cells = [],
		i = 0,
		nCells = height_ * width_;
	for (i; i < nCells; ++i) cells[i] = {
		state: 0
	};

	// ref neighbors
	var neighborIndexes = [-1, -width_ - 1, // top left 
		-1, -width_, // top
		-1, -width_ + 1, // top right
		0, -1, // left
		0, 1, // right
		1, width_ - 1, // bottom left 
		1, width_, // bottom
		1, width_ + 1 // bottom right
	],
		neighbors = null,
		cell = null,
		j = 0;
	for (i = 0; i < nCells; ++i) {

		neighbors = [];
		for (j = 0; j < 8; ++j) {

			// expected line

			// expected index
		}
	}
	return cells;
}

var Automaton = function(height_, width_) {


	var self = {};

}