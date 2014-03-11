// each cell should know its neighbors in order to update its state
class Cell {

  int numNeighbors;
  float state, nextState, q, k1, k2, g;
  Cell[] neighbors;

  Cell(Float q_, Float k1_, Float k2_, Float g_) {
    q = q_;
    k1 = k1_;
    k2 = k2_;
    g = g_;
    state = round(random(1, q));
  }

  void setNeighbors(Cell[] neighbors_) {
    neighbors = neighbors_;
    numNeighbors = neighbors.length;
  }

  // evaluate next state
  void evalNextState() {

    if (state == q) {
      // (iv) A cell in state q changes to state 1.
      nextState = 1;
      return;
    } 

    int s1 = 0;
    int sq = 0;
    int sbetween = 0;

    Cell c;
    for (int i = 0; i < numNeighbors; i++) {
      c = neighbors[i];
      if (c.state == 1) s1++;
      else if (c.state == q) sq++;
      else sbetween++;
    }

    if (state == 1) {
      // (v) A cell in state 1 changes to state a/k1 + b/k2 + 1 where a is the number of neighbors of the cell 
      // which are in states 2 through q-1 and b is the number of neighbors in state q.
      nextState = sbetween / k1 + sq / k2 + 1;
    } 
    else {
      // (vi) A cell in any of states 2 through q-1 changes to S/(9 - c) + g, where S is the sum of the states 
      // of the cell and its neighbors and c is the number of neighbors in state 1.
      nextState = _sumStates() / (numNeighbors + 1 - s1) + g;
    }
    // (vii) If the application of rule (v) or rule (vi) would result in a cell having a state > q then the state of that cell becomes q.
    nextState = round(min(q, nextState));
  }

  Float _sumStates() {
    float sum = 0;
    for (int i = 0; i < numNeighbors; i++) {
      sum += neighbors[i].state;
    }
    sum += state;
    return sum;
  }

  color update() {
    state = nextState;
    float val = state / q;
    return color(val * 255, val * 255, val * 255);
  }
}

