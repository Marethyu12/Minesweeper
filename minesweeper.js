/*
 * TODO:
 * - Implement flag feature
 * - Modify game logic a bit
 * - Decorations
 * - Play again button
 * - Fix some shit, as suggested by the console:
 *   Uncaught RangeError: Maximum call stack size exceeded
		 at RegExp.exec (<anonymous>)
		 at new k.fn.init (jquery-3.4.1.min.js:2)
		 at k (jquery-3.4.1.min.js:2)
		 at refreshGrid (minesweeper.js:61)
		 at openCell (minesweeper.js:124)
		 at openCell (minesweeper.js:119)
		 at openCell (minesweeper.js:119)
		 at openCell (minesweeper.js:119)
		 at openCell (minesweeper.js:119)
		 at openCell (minesweeper.js:119)
 */

const rows = 10;
const cols = 10;

const probabiliy = 30.0;

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

function initGrid() {
	cells = [];
	
	for (var i = 0; i < rows; i++) {
		cells.push([]);
		
		for (var j = 0; j < cols; j++) {
			cells[i][j] = Cell(i, j);
		}
	}
}

function refreshGrid() {
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
					
					if (withInBounds(row, col) && cells[row][col].data != '*') {
						var num = parseInt(cells[row][col].data) + 1;
						
						cells[row][col].data = num.toString();
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
	} else if (cells[row][col].data == "0") {
		for (var i = 0; i < 8; i++) {
			var nextRow = row + dr[i];
			var nextCol = col + dc[i];
			
			if (withInBounds(nextRow, nextCol) && cells[nextRow][nextCol].data != "*") {
				openCell(nextRow, nextCol); // recursively open neighbouring cells
			}
		}
	}
	
	refreshGrid();
	
	if (clickedMine) {
		alert("You clicked on a mine!");
		alert("Game over bro!");
		window.close();
	}
}

function initGame() {
	initGrid();
	populateMines(probabiliy);
	fillWithNumbers();
	refreshGrid();
}