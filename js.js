

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
		for (let i = rowIndex + rowEnd; i > rowIndex; i--) {
			if (board[i].marked == false) {
				winnerFound = false;
				break;
			} else if (board[i].player !== board[i - 1].player) {
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
			console.log("leftD");
			return true;
		}

		if (checkRightDiagonal()) {
			console.log("rightD");
			return true;
		}

		if (checkRow(row)) {
			console.log("row");
			return true;
		}

		if (checkColumn(column)) {
			console.log("column");
			return true;
		}

		return false;
	}

	return {
		setBoard,
		getSize,
		getCells,
		markBoard,
		getRowFromPosition,
		getColumnFromPosition,
		checkWinner,
	}
})();

const Display = (function() {
	const showPlayerPositions = (board, tiles, playerOneName) => {
		for (const [i, tile] of tiles.entries()) {
			if (board[i].marked !== false) {
				tile.textContent = (board[i].player == playerOneName) ? "⭕" : "❌";
			} else {
				tile.textContent = "";
			}
		}
	}

	const toggleNewGameButton = () => {
		const newGameSection = document.querySelector(".new-game");
		newGameSection.classList.toggle("invisible");
	}

	const togglePlayerNameForm = () => {
		const form = document.querySelector("form");
		form.classList.toggle("invisible");
	}

	const toggleResultText = () => {
		const gameResult = document.querySelector(".result-text");
		gameResult.classList.toggle("invisible");
	}

	const updatedResultText = (text) => {
		const gameResult = document.querySelector(".result-text");
		gameResult.textContent = text;
	}

	return {
		showPlayerPositions,
		toggleNewGameButton,
		togglePlayerNameForm,
		toggleResultText,
		updatedResultText,
	}
})();

const Game = (function(Board, Display) {
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

	const resetTurnNumber = () => {
		turnNumber = 1;
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
		turnPlayer = !turnPlayer;
	}

	const gameStartedOn = () => {
		gameStarted = true;
	}

	const gameStartOff = () => {
		gameStarted = false;
	}

	const isGameStarted = () => {
		return gameStarted;
	}

	const progressGameState = (boardMarked, winnerFound) => {
		if (winnerFound) {
			Display.updatedResultText(`Winner is ${getTurnPlayer()}`);
			Display.toggleResultText();
			gameStartOff()
		} else if (isMaxTurn(Board.getSize())) {
			Display.updatedResultText(`Draw! No winner found`);
			Display.toggleResultText();
			gameStartOff();
		} else if (boardMarked) {
			changeTurnPlayer();
			incrementTurn();
		}
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
		resetTurnNumber,
		isMaxTurn,
		gameStartedOn,
		gameStartOff,
		isGameStarted,
		progressGameState,
	}
})(GameBoard, Display);

document.addEventListener("DOMContentLoaded", function() {
	/* Hold references to these variables in modules */
	/* Can you wrap a function in DOM content loaded to fetch and return these? */
	const tiles = document.querySelectorAll(".tile");
	const form = document.querySelector("form");
	const newGameButton = document.querySelector(".new-game");

	for (const tile of tiles) {
		tile.addEventListener("click", function() {
			if (Game.isGameStarted()) {
				const position = tile.dataset.id;
				const boardMarked = GameBoard.markBoard(position, Game.getTurnPlayer());
				const winnerFound = GameBoard.checkWinner(position);
				Game.progressGameState(boardMarked, winnerFound);
				Display.showPlayerPositions(GameBoard.getCells(), tiles, Game.getPlayerOneName());
			}
		});
	}

	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const data = new FormData(form);
		/* Consider moving this to its own function called startGame in Game module*/
		const playerOneName = data.get("player-one");
		const playerTwoName = data.get("player-two");
		Game.setPlayerOne(playerOneName);
		Game.setPlayerTwo(playerTwoName);
		GameBoard.setBoard();
		Game.resetTurnNumber();
		Display.showPlayerPositions(GameBoard.getCells(), tiles, Game.getPlayerOneName());
		Display.togglePlayerNameForm();
		Display.toggleNewGameButton();
		Game.gameStartedOn();
	});

	newGameButton.addEventListener("click", () => {
		GameBoard.setBoard();
		Game.gameStartOff();
		Game.resetTurnNumber();
		Display.showPlayerPositions(GameBoard.getCells(), tiles, Game.getPlayerOneName());
		Display.togglePlayerNameForm();
		Display.toggleNewGameButton();
	})
})
