/*
 * TODO:
 * - Implement flag feature
 * - Modify game logic a bit
 * - Fancy decorations (implement style.css) (finish this!)
 * - Play again button
 * - Scoring system
 */

const rows = 10;
const cols = 10;

const probabiliy = 20.0;

const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
const dc = [-1, 0, 1, -1, 1, -1, 0, 1];

var cells;

function Cell(row, col) {
	return {
		row : row,
		col : col,
		data : "0",
		opened : false,
		isMine : function() {
			return (this.data == "*");
		}
	};
}

function changeClass(idStr, from, to) {
	if ($("#" + idStr).hasClass(from)) {
		$("#" + idStr).removeClass(from);
	}
	
	$("#" + idStr).addClass(to);
}

function initGrid() {
	cells = [];
	
	for (var i = 0; i < rows; i++) {
		cells.push([]);
		
		for (var j = 0; j < cols; j++) {
			cells[i].push(Cell(i, j));
			// changeClass(i.toString() + j.toString(), "opencell", "closedcell");
		}
	}
}

function refreshGrid() {
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			var data = cells[i][j].data;
			var idStr = i.toString() + j.toString();
			
			if (!cells[i][j].opened) {
				$("#" + idStr).val("\u25A1"); // square character
			} else if (data == "0") {
				$("#" + idStr).val(" ");
			} else {
				$("#" + idStr).val(data);
			}
		}
	}
}

function populateMines() {
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			if ((Math.random() * 100.0) <= probabiliy) {
				cells[i][j].data = "*";
			}
		}
	}
}

function withInBounds(row, col) {
	return (row >= 0 && row < rows && col >= 0 && col < cols);
}

function numberSquares() {
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			if (cells[i][j].isMine()) {
				for (var k = 0; k < 8; k++) {
					var row = i + dr[k];
					var col = j + dc[k];
					
					if (withInBounds(row, col) && !cells[row][col].isMine()) {
						var num = parseInt(cells[row][col].data) + 1;
						
						cells[row][col].data = num.toString();
					}
				}
			}
		}
	}
}

function openCell(row, col) {
	if (cells[row][col].opened) {
		return;
	}
	
	var clickedMine = false;
	
	cells[row][col].opened = true;
	// changeClass(i.toString() + j.toString(), "closedcell", "opencell");
	
	if (cells[row][col].isMine()) {
		clickedMine = true;
	} else if (cells[row][col].data == "0") {
		for (var i = 0; i < 8; i++) {
			var nextRow = row + dr[i];
			var nextCol = col + dc[i];
			
			if (withInBounds(nextRow, nextCol) && !cells[nextRow][nextCol].isMine()) {
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
	populateMines();
	numberSquares();
	refreshGrid();
}