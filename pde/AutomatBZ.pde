Cell[] cells;
int numCells, cellSide, cellsPerLine, cellsPerColumn;

void setup() {
  // setup cells
  cellSide = 4;
  int w = 400;
  int h = 400;
  stroke(0);
  smooth();
  size(w, h);
  frameRate(30);
  //-- create cells
  cellsPerLine = floor(w / cellSide) - 1;
  cellsPerColumn = floor(h / cellSide) - 1;
  numCells = cellsPerLine * cellsPerColumn;
  cells = new Cell[numCells];
  float q = 160; //round(random(2, 255));
  float k1 = 3; //round(random(1, 8));
  float k2 = 30; //round(random(1, 8));
  float g = round(random(0, 100));
  for (int i = 0; i < numCells; i++) {
    cells[i] = new Cell(q, k1, k2, g);
  }
  //-- set neighbors
  Cell c;
  int index = -1, n;
  ArrayList<Cell> neighbors = new ArrayList<Cell>();
  for (int i = 0; i < numCells; i++) {
    neighbors.clear();
    //-- top left
    _addNeighbor(i, -1, -1, neighbors);
    //-- top
    _addNeighbor(i, 0, -1, neighbors);
    //-- top right
    _addNeighbor(i, 1, -1, neighbors);
    //-- left
    _addNeighbor(i, -1, 0, neighbors);
    //-- right
    _addNeighbor(i, 1, 0, neighbors);
    //-- bottom left
    _addNeighbor(i, -1, 1, neighbors);
    //-- bottom
    _addNeighbor(i, 0, 1, neighbors);
    //-- bottom right
    _addNeighbor(i, 1, 1, neighbors);

    cells[i].setNeighbors(neighbors.toArray(new Cell[neighbors.size()]));
  }
}

int _col(int index) {
  return floor(index % cellsPerLine);
}

int _line(int index) {
  return floor(index / cellsPerLine);
}

void _addNeighbor(int index, int dx, int dy, ArrayList<Cell> list) {
  int rIndex = index + dx * cellsPerLine + dy;
  if (rIndex > -1 && rIndex < numCells && (_line(rIndex) - _line(index)) == dx && (_col(rIndex) - _col(index)) == dy) {
    list.add(cells[rIndex]);
  }
}

void draw() {
  // eval next state
  for (int i = 0; i < numCells; i++) {
    cells[i].evalNextState();
  }
  // update & draw cells
  for (int i = 0; i < numCells; i++) {
    fill(cells[i].update());
    rect((i % cellsPerLine) * cellSide, floor(i / cellsPerColumn) * cellSide, cellSide, cellSide);
  }
}

