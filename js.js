

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
		return structuredClone(board);
	}

	const markBoard = (position, name) => {
		if (!board[position].marked) {
			board[position].marked = true;
			board[position].player = name;
			return true;
		}
		return false;
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
				break;
			} else if (board[i - jump].player !== board[i].player) {
				winnerFound = false;
				break;	
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
				break;
			} else if (board[i - jump].player !== board[i].player) {
				winnerFound = false;
				break;
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
				break;
			} else if (board[rowIndex + i - 1].player !== board[i].player) {
				winnerFound = false;
				break;
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
				break;
			} else if (board[i].player !== board[i - rowSize].player) {
				winnerFound = false;
				break;
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
	let turnNumber = 1;
	let gameStarted = false;

	const createPlayer = (name) => {
		return {name};
	}

	const setPlayerOne = (name) => {
		playerOne = createPlayer(name);
	}

	const setPlayerTwo = (name) => {
		playerTwo = createPlayer(name);
	}

	const getPlayerOneName = () => {
		return playerOne.name;
	}

	const getPlayerTwoName = () => {
		return playerTwo.name;
	}

	const incrementTurn = () => {
		turnNumber++;
	}

	const getTurnNumber = () => {
		return turnNumber;
	}

	const isMaxTurn = (boardSize) => {
		if (turnNumber >= boardSize) {
			return true;
		} else {
			return false;
		}
	}
	
	const getTurnPlayer = () => {
		return turnPlayer == true ? playerOne.name : playerTwo.name;
	}

	const changeTurnPlayer = () => {
		turnPlayer = (turnPlayer == true) ? false : true;
	}

	const changeGameStart = () => {
		gameStarted = (gameStarted == true) ? false : true;
	}

	const isGameStarted = () => {
		return gameStarted;
	}

	return {
		setPlayerOne,
		setPlayerTwo,
		getPlayerOneName,
		getPlayerTwoName,
		getTurnPlayer,
		changeTurnPlayer,
		getTurnNumber,
		incrementTurn,
		isMaxTurn,
		changeGameStart,
		isGameStarted,
	}
})();

const Display = (function() {
	const showPlayerPositions = (board, tiles, playerOneName) => {
		for (const [i, tile] of tiles.entries()) {
			if (board[i].marked !== false) tile.textContent = (board[i].player == playerOneName) ? "⭕" : "❌";
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
			if (Game.isGameStarted()) {
				const position = tile.dataset.id;
				const boardMarked = GameBoard.markBoard(position, Game.getTurnPlayer());
				Display.showPlayerPositions(GameBoard.getCells(), tiles, Game.getPlayerOneName());
	
				if (GameBoard.checkWinner(position)) {
					console.log("winner!");
				} else if (Game.isMaxTurn(GameBoard.getSize())) {
					console.log("draw!");
				} else if (boardMarked) {
					Game.changeTurnPlayer();
					Game.incrementTurn();
				}
			}
		});
	}

	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const data = new FormData(form);
		switch (Game.isGameStarted()) {
			case true:
				break;
			case false:
				const playerOneName = data.get("player-one");
				const playerTwoName = data.get("player-two");
				Game.setPlayerOne(playerOneName);
				Game.setPlayerTwo(playerTwoName);
				Game.changeGameStart();
				break;
		}
	});
})
