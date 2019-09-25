const rows = 9;
const cols = 9;

var hidden;
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

function recur(row, col) {
	if (cells[row][col] == '*') {
		
	}
}

function gameInit() {
	hidden = new2DArray(rows, cols, true);
	cells = new2DArray(rows, cols, '0');
	populateMines(30.0);
}

function gameEnd() {

}