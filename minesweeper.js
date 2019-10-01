const rows = 10;
const cols = 10;

const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
const dc = [-1, 0, 1, -1, 1, -1, 0, 1];

var cells;

function Cell(row, col) {
	return {
		"row" : row,
		"col" : col,
		"data" : "0",
		"opened" : false
	};
}

function init2DGrid() {
	cells = [];
	
	for (var i = 0; i < rows; i++) {
		cells.push([]);
		
		for (var j = 0; j < cols; j++) {
			cells[i][j] = Cell(i, j);
		}
	}
}

function refresh2DGrid() {
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			var data = cells[i][j].data;
			var idStr = i.toString() + j.toString();
			
			if (!cells[i][j].opened) {
				$("#" + idStr).val("\u25A1"); // square char
			} else if (data == "0") {
				$("#" + idStr).val(" ");
			} else {
				$("#" + idStr).val(data); // ? char to string ?!?
			}
		}
	}
}

function populateMines(probabiliy) {
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			if ((Math.random() * 100) <= probabiliy) {
				cells[i][j].data = "*";
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

function fillWithNumbers() {
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			if (cells[i][j].data == "*") {
				for (var k = 0; k < 8; k++) {
					var row = i + dr[k];
					var col = j + dc[k];
					
					if (withInBounds(row, col)) {
						cells[i][j].data.replace("0", String.fromCharCode(parseInt(cells[i][j].data.charAt(0)) + 1));
					}
				}
			}
		}
	}
}

function openCell(row, col) {
	var clickedMine = false;
	
	cells[row][col].opened = true;
	
	if (cells[row][col].data == "*") {
		clickedMine = true;
	} else if (cells[row][col] == "0") {
		for (var i = 0; i < 8; i++) {
			var nextRow = row + dr[i];
			var nextCol = col + dc[i];
			
			if (withInBounds(nextRow, nextCol) && cells[nextRow][nextCol] != '*') {
				openCell(nextRow, nextCol); // recursively open neighbouring cells
			}
		}
	}
	
	refresh2DGrid();
	
	if (clickedMine) {
		endGameAction("You clicked on a mine!");
	}
}

function initGame() {
	init2DGrid();
	populateMines(30.0);
	fillWithNumbers();
	refresh2DGrid();
	// location.reload(); // refresh a page
}

function endGameAction(msg) {
	alert(msg);
	// do some random shit...
}