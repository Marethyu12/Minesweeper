// TODO: represent each cell as objects

const rows = 9;
const cols = 9;

const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
const dc = [-1, 0, 1, -1, 1, -1, 0, 1];

var visible;
var cells;

function new2DArray(rows, cols, val) {
	var m = [];
	
	for (var i = 0; i < rows; i++) {
		m.push(new Array(cols));
		
		for (var j = 0; j < cols; j++) {
			m[i][j] = val;
		}
	}
	
	return m;
}

function populateMines(probabiliy) {
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			if ((Math.random() * 100) <= probabiliy) {
				cells[i][j] = '*';
			}
		}
	}
}

function fillWithNumbers() {
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			if (cells[i][j] == '*') {
				for (var k = 0; k < 8; k++) {
					var row = i + dr[k];
					var col = j + dc[k];
					
					if (withInBounds(row, col)) {
						cells[row][col]++;
					}
				}
			}
		}
	}
}

function withInBounds(row, col) {
	if (row >= 0 && row < rows && col >= 0 && col < cols) {
		return true;
	}
	
	return false;
}

function openCell(row, col) {
	if (cells[row][col] == '*') {
		visible[row][col] = true;
		// refresh
		endGameAction("You clicked on a mine!");
	} else if (cells[row][col] == '0') {
		for (var i = 0; i < 8; i++) {
			var nextRow = row + dr[i];
			var nextCol = col + dc[i];
			
			if (withInBounds(nextRow, nextCol) && cells[nextRow][nextCol] != '*') {
				openCell(nextRow, nextCol); // recursively open neighbouring cells
			}
		}
	} // else do nothing (for cells[row][col] > '0')
}

function initGame() {
	visible = new2DArray(rows, cols, false);
	cells = new2DArray(rows, cols, '0');
	populateMines(30.0);
	fillWithNumbers();
}

function endGameAction(msg) {
	alert(msg);
	// do some random shit...
}