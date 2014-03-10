// TODO: AutomatonUtil <> Automaton, similar relation between obj & class in Scala?

var AutomatonRules = {

	// rule: "STATE IS NUMBER OF NEIGHBORS" for debug
	countNeighbors: function() {
		nextState = neighbors.length;
	}
}

var AutomatonUtil = {

	// generate a data structure representing cells and their neighbors
	genCells: function(height_, width_) {

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
				if (index > -1 && index < nCells && lineOf(index) == lineOf(i + dLine))
					neighbors.push(cells[index]);
			}
			cells[i].neighbors = neighbors;
		}
		return cells;
	},

	lineOf: function(width_, index_) {
		return Math.floor(index / width_);
	},

	columnOf: function(height_, width_, index_) {
		return index % width_;
	},

	// returns an array representing latest cells state
	updateCells: function(cells, rule) {
		var len = cells.length,
			i = 0,
			states = [];
		for (; i < len; ++i) rule.call(cells[i]) // state evaluation
		for (i = 0; i < len; ++i) states[cells[i].state = cells[i].nextState]; // state transition
		return states;
	}
};

var Automaton = function(height_, width_) {

	var self = {},
		u = AutomatonUtil,
		rule = null,
		cells = u.genCells(height_, width_);

	self.update = function(){
		u.updateCells(cells, rule);
	}

	self.rule = function(arg){
		if (typeof arg == 'function') rule = arg;
		return rule;
	}

	return self;
}