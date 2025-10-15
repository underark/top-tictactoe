

const GameBoard = (function() {
	const rowSize = 3;
	const boardSize = rowSize * rowSize;
	const board = new Array(boardSize);

	function createTile() {
		return {
			marked: false,
			player: "",
		}
	}

	const setBoard = () => {
		for (let i = 0; i < boardSize; i++) {
			board[i] = createTile();
		}
	}

	const getSize = () => {
		return boardSize;
	}

	const getCells = () => {
		const array = new Array();
		for (let i = 0; i < boardSize; i++) {
			array.push(board[i]);
		}
		return array;
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

		if (checkLeftDiagonal()) {
			return true;
		}

		if (checkRightDiagonal()) {
			return true;
		}

		if (checkRow(row)) {
			return true;
		}

		if (checkColumn(column)) {
			return true;
		}

		return false;
	}

	setBoard();
	return {
		getSize,
		getCells,
		markBoard,
		getRowFromPosition,
		getColumnFromPosition,
		checkWinner,
	}
})();

const Game = (function() {
	let playerOne;
	let playerTwo;
	let turnPlayer = true;

	const createPlayer = (name) => {
		return {name};
	}

	const setPlayerOne = (name) => {
		playerOne = createPlayer(name);
	}

	const setPlayerTwo = (name) => {
		playerTwo = createPlayer(name);
	}
	
	const getTurnPlayer = () => {
		return turnPlayer == true ? playerOne.name : playerTwo.name;
	}

	const changeTurnPlayer = () => {
		turnPlayer = (turnPlayer == true) ? false : true;
	}

	return {
		setPlayerOne,
		setPlayerTwo,
		getTurnPlayer,
		changeTurnPlayer,
	}
})();

const Display = (function() {
	const showPlayerPositions = (board, tiles) => {
		for (const [i, tile] of tiles.entries()) {
			tile.textContent = board[i].player;
		}
	}

	return {
		showPlayerPositions,
	}
})();

document.addEventListener("DOMContentLoaded", function() {
	const tiles = document.querySelectorAll(".tile");
	const form = document.querySelector("form");

	for (const tile of tiles) {
		tile.addEventListener("click", function() {
			GameBoard.markBoard(tile.dataset.id, Game.getTurnPlayer());
			Game.changeTurnPlayer();
			Display.showPlayerPositions(GameBoard.getCells(), tiles);
		});
	}

	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const data = new FormData(form);
		const playerOneName = data.get("player-one");
		const playerTwoName = data.get("player-two");
		Game.setPlayerOne(playerOneName);
		Game.setPlayerTwo(playerTwoName);
	});
})
