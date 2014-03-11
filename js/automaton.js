// TODO: AutomatonUtil <> Automaton, similar relation between obj & class in Scala?

var AutomatonRule = {
	// helper
	sumStates: function() {
		var i = 0,
			sum = this.state,
			numNeighbors = this.neighbors.length;
		for (; i < numNeighbors; ++i)
			sum += this.neighbors[i].state;
		return sum;
	},
	// rule: "STATE IS NUMBER OF NEIGHBORS" for debug
	countNeighbors: function() {
		this.nextState = this.neighbors.length;
	},

	bz: function(q, k1, k2, g) {

		if (this.state == q) {
			// (iv) A cell in state q changes to state 1.
			return this.nextState = 1;
		}

		var s1 = 0,
			sq = 0,
			sbetween = 0,
			c = null,
			i = 0,
			numNeighbors = this.neighbors.length;

		for (; i < numNeighbors; ++i) {
			c = this.neighbors[i];
			if (c.state == 1)++s1;
			else if (c.state == q)++sq;
			else ++sbetween;
		}

		if (this.state == 1) {
			// (v) A cell in state 1 changes to state a/k1 + b/k2 + 1 where a is the number of neighbors of the cell 
			// which are in states 2 through q-1 and b is the number of neighbors in state q.
			this.nextState = sbetween / k1 + sq / k2 + 1;
		} else {
			// (vi) A cell in any of states 2 through q-1 changes to S/(9 - c) + g, where S is the sum of the states 
			// of the cell and its neighbors and c is the number of neighbors in state 1.
			this.nextState = AutomatonRule.sumStates.call(this) / (numNeighbors + 1 - s1) + g;
		}
		// (vii) If the application of rule (v) or rule (vi) would result in a cell having a state > q then the state of that cell becomes q.
		this.nextState = Math.round(Math.min(q, this.nextState));
	}
}

// a funcitonal mixin with caching
// http://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/
var AutomatonUtil = (function() {

	// generate a data structure representing cells and their neighbors
	function genCells(width, height) {

		// init cells
		var cells = [],
			i = 0,
			nCells = height * width;

		for (i; i < nCells; ++i) cells[i] = {
			state: 0,
			nextState: 0
		};

		function getIndex(x_, y_) {
			return (x_ > -1 && x_ < width && y_ > -1 && y_ < height) ? y_ * width + x_ : -1;
		}

		// ref neighbors
		var neighbors = null,
			nIndex = null,
			j = 0,
			k = 0,
			x = 0,
			y = 0;

		for (i = 0; i < nCells; ++i) {
			neighbors = [];
			x = i % width;
			y = Math.floor(i / width);
			for (j = -1; j < 2; ++j) {
				for (k = -1; k < 2; ++k) {
					if ((nIndex = getIndex(x + j, y + k)) != -1 && nIndex != i)
						neighbors.push(cells[nIndex]);
				}
			}
			console.log(neighbors.length);
			cells[i].neighbors = neighbors;
		}
		return cells;
	}

	// returns an array representing latest cells state
	function updateCells(cells, rule) {
		var len = cells.length,
			i = 0,
			states = [];
		for (i = 0; i < len; ++i) rule.call(cells[i]) // state evaluation
		for (i = 0; i < len; ++i) states[i] = cells[i].state = cells[i].nextState; // state transition
		return states;
	}

	return function() {
		this.genCells = genCells;
		this.updateCells = updateCells;
		return this;
	}
})();

var Automaton = function(height_, width_) {
	this.rule = null,
	this.cells = this.genCells(height_, width_);
}

Automaton.prototype = {
	constructor: Automaton,
	update: function() {
		return this.updateCells(this.cells, this.rule);
	}
}

AutomatonUtil.call(Automaton.prototype);