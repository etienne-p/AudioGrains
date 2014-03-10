// automaton is responsible for applying rules on cells,
// exposing cell states, but not rendering them
var AutomatonUtil = {


}

// TODO: move it outside automaton for reuse, is it really a mixin?
	function mixin(ctx, obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop) && !ctx.hasOwnProperty(prop)) ctx[prop] = obj[prop];
			else throw new Error('mixin failed at prop: [' + prop + ']'); // TODO: better Error Handling
		}
	}

var Automaton = function(height_, width_) {

	// incorporate utils
	//mixin(this, AutomatonUtil);

	var self = {};

	// functional helpers

	// generate a data structure representing cells and their neighbors
	function genCells(height_, width_) {

		// init cells
		var cells = [],
			i = 0,
			nCells = height_ * width_;

		for (i; i < nCells; ++i) cells[i] = {
			state: 0,
			nextState: 0
		};

		// ref neighbors
		var neighbors = null,
			cell = null,
			dLine, dIndex, index,
			j = 0,
			neighborIndexes = [-1, -width_ - 1, // top left 
				-1, -width_, // top
				-1, -width_ + 1, // top right
				0, -1, // left
				0, 1, // right
				1, width_ - 1, // bottom left 
				1, width_, // bottom
				1, width_ + 1 // bottom right
			];

		for (i = 0; i < nCells; ++i) {
			neighbors = [];
			for (j = 0; j < 8; ++j) {
				dLine = neighborIndexes[j * 2];
				dIndex = neighborIndexes[j * 2 + 1];
				index = i + dIndex;
				if (index > -1 && index < nCells && lineOf(dIndex + dLine) == lineOf(i))
					neighbors.push(cells[i]);
			}
		}
		return cells;
	}

	function lineOf(width_, index_) {
		return Math.floor(index / width_);
	}

	function columnOf(height_, width_, index_) {
		return index % width_;
	}

	// rule: this is expected to be a cell
	function mockRule() {
		var i = neighbors.length;
		while (i--) neighbors[i].prevState; * .nextState =
	}

	// TODO: add a rule: "STATE IS NUMBER OF NEIGHBORS" for debug

	// returns an array representing latest cells state
	function updateCells(cells, rule) {
		var len = cells.length,
			i = 0,
			states = [];
		// state evaluation
		for (; i < len; ++i) {
			// currentStateIndex: let the rule wich index of states array is considered to be the current state
			rule.call(cells[i])
		}
		// state transition
		for (i = 0; i < len; ++i) states[cells[i].state = cells[i].nextState];

		return states;
	}

}