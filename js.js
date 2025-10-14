function createPlayer(name) {
	return {name};
}

function createTile() {
	return {
		marked: false,
		player: "",
	}
}

const GameBoard = (function() {
	const rowSize = 3;
	const boardSize = rowSize * rowSize;
	const board = new Array(boardSize);

	const setBoard = () => {
		for (let i = 0; i < boardSize; i++) {
			board[i] = createTile();
		}
	}

	const showBoard = () => {
		console.log(board);
	}

	const markBoard = (position, name) => {
		if (position >= 0 && position <= boardSize) {
			board[position].marked = true;
			board[position].player = name;
		}
	}

	const getRowFromPosition = (position) => {
		return Math.floor(position / rowSize);
	}

	const getColumnFromPosition = (position) => {
		const row = getRowFromPosition(position);
		return position - (row * rowSize);
	}

	const checkLeftDiagonal = () => {
		const jump = rowSize + 1;
		let winnerFound = true;
		for (let i = jump; i < boardSize; i += jump) {
			if (board[i].marked == false) {
				winnerFound = false;
			} else if (board[i - jump].player !== board[i].player) {
				winnerFound = false;	
			} 
		}
		return winnerFound;
	}

	const checkRightDiagonal = () => {
		const jump = rowSize - 1;
		const end = boardSize - rowSize;
		let winnerFound = true;
		for (let i = jump * 2; i <= end; i += jump) {
			if (board[i].marked == false) {
				winnerFound = false;
			} else if (board[i - jump].player !== board[i].player) {
				winnerFound = false;	
			} 
		}
		return winnerFound;
	}

	const checkRow = (row) => {
		let winnerFound = true;
		const rowEnd = rowSize - 1;
		const rowIndex = row * 3;
		for (let i = rowEnd; i > 0; i--) {
			if (board[rowIndex + i].marked == false) {
				winnerFound = false;
			} else if (board[rowIndex + i - 1].player !== board[i].player) {
				winnerFound = false;
			}
		}
		return winnerFound;
	}

	const checkColumn = (column) => {
		let winnerFound = true;
		const columnEnd = column + rowSize * (rowSize - 1);
		for (let i = columnEnd; i > column; i -= rowSize) {
			if (board[i].marked == false) {
				winnerFound = false;
			} else if (board[i].player !== board[i - rowSize].player) {
				winnerFound = false;
			}
		}
		return winnerFound;
	}

	const checkWinner = (position) => {
		const row = getRowFromPosition(position);
		const column = getColumnFromPosition(position);

		if (checkLeftDiagonal) return true;

		if (checkRightDiagonal) return true;

		if (checkRow(row)) return true;

		if (checkColumn(column)) return true;

		return false;
	}

	setBoard();
	return {
		showBoard,
		markBoard,
		getRowFromPosition,
		getColumnFromPosition,
		checkWinner,
	}
})();

const game = (function(board) {
})(GameBoard);

const Alex = createPlayer("Alex");
const Peter = createPlayer("Peter");
GameBoard.markBoard(1, Peter.name);
GameBoard.markBoard(4, Peter.name);
GameBoard.markBoard(7, Peter.name);
console.log(GameBoard.checkColumn(1));
