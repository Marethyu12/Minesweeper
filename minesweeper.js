const rows = 9;
const cols = 9;

const probabiliy = 15.0;

const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
const dc = [-1, 0, 1, -1, 1, -1, 0, 1];

var cells;
var nonminecells;
var gameStarted;
var seconds;
var timer;
var timerStopped = true;

function Cell() {
    return {
        data : "0",
        opened : false,
        flagged : false,
        isMine : function() {
            return (this.data == "*");
        }
    };
}

function changeCSSClass(idStr, from, to) {
    if ($("#" + idStr).hasClass(from)) {
        $("#" + idStr).removeClass(from);
    }
    
    $("#" + idStr).addClass(to);
}

function startTimer() {
    timer = setInterval(function() {
        seconds++;
        $("#textfield").val(seconds.toString());
    }, 1000);
    
    timerStopped = false;
}

function stopTimer() {
    clearInterval(timer);
    timerStopped = true;
}

function initGrid() {
    cells = [];
    
    for (var i = 0; i < rows; i++) {
        cells.push([]);
        
        for (var j = 0; j < cols; j++) {
            cells[i].push(Cell());
            changeCSSClass(i.toString() + j.toString(), "opencell", "closedcell");
        }
    }
}

function refreshGrid() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var data = cells[i][j].data;
            var idStr = i.toString() + j.toString();
            
            if (!cells[i][j].opened) {
                if (!cells[i][j].flagged) {
                    $("#" + idStr).val("\u25A1"); // square character
                } else {
                    $("#" + idStr).val("\u2690"); // flag character
                }
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
            if ((Math.random() * 100.0) < probabiliy) {
                cells[i][j].data = "*";
            } else {
                nonminecells++;
            }
        }
    }
}

function withinBounds(row, col) {
    return (row >= 0 && row < rows && col >= 0 && col < cols);
}

function numberSquares() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (cells[i][j].isMine()) {
                for (var k = 0; k < 8; k++) {
                    var row = i + dr[k];
                    var col = j + dc[k];
                    
                    if (withinBounds(row, col) && !cells[row][col].isMine()) {
                        var num = parseInt(cells[row][col].data) + 1;
                        
                        cells[row][col].data = num.toString();
                    }
                }
            }
        }
    }
}

function openCell(row, col) {
    if (cells[row][col].opened || cells[row][col].flagged) {
        return;
    }
    
    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }
    
    var clickedMine = false;
    
    cells[row][col].opened = true;
    changeCSSClass(row.toString() + col.toString(), "closedcell", "opencell");
    
    if (cells[row][col].isMine()) {
        clickedMine = true;
    } else if (cells[row][col].data == "0") {
        for (var i = 0; i < 8; i++) {
            var nextRow = row + dr[i];
            var nextCol = col + dc[i];
            
            if (withinBounds(nextRow, nextCol) && !cells[nextRow][nextCol].isMine()) {
                openCell(nextRow, nextCol); // recursively open neighbouring cells
            }
        }
    }
    
    if (clickedMine) {
        stopTimer();
        alert("You clicked on a mine! Game over bro!");
        
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                if (!cells[i][j].opened) {
                    cells[i][j].opened = true;
                    changeCSSClass(i.toString() + j.toString(), "closedcell", "opencell");
                }
            }
        }
    }
    
    if (!clickedMine && --nonminecells == 0) {
        stopTimer();
        alert("You won bro!");
        
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                if (cells[i][j].isMine()) {
                    cells[i][j].flagged = true;
                }
            }
        }
    }
    
    refreshGrid();
}

function newGame() {
    initGrid();
    
    nonminecells = 0;
    
    populateMines();
    numberSquares();
    refreshGrid();
    
    gameStarted = false;
    seconds = 0;
    $("#textfield").val(seconds.toString());
    
    if (!timerStopped) {
        clearInterval(timer);
    }
}
