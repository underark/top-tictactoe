

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
	const showPlayerPositions = (board, playerOneName) => {
		const tiles = document.querySelectorAll(".tile");
		for (const [i, tile] of tiles.entries()) {
			if (board[i].marked !== false) {
				tile.textContent = (board[i].player == playerOneName) ? "⭕" : "❌";
			} else {
				tile.textContent = "";
			}
		}
	}

	const disableBoard = () => {
		const tiles = document.querySelectorAll(".tile");
		for (const tile of tiles) {
			tile.classList.add("disabled");
		}
	}

	const enableBoard = () => {
		const tiles = document.querySelectorAll(".tile");
		for (const tile of tiles) {
			tile.classList.remove("disabled");
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

	const hideResultText = () => {
		const gameResult = document.querySelector(".result-text");
		gameResult.classList.add("invisible");
	}

	const updateWinnerText = (name) => {
		const gameResult = document.querySelector(".result-text");
		const nameSpan = document.createElement("span");
		nameSpan.textContent = name;
		gameResult.textContent = `Winner is `;
		gameResult.appendChild(nameSpan);
	}

	const updateDrawText = () => {
		const gameResult = document.querySelector(".result-text");
		gameResult.textContent = `It's a draw!`;
	}

	return {
		showPlayerPositions,
		toggleNewGameButton,
		togglePlayerNameForm,
		toggleResultText,
		hideResultText,
		updateWinnerText,
		updateDrawText,
		enableBoard,
		disableBoard,
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

	const gameStartOn = () => {
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
			Display.updateWinnerText(getTurnPlayer());
			Display.toggleResultText();
			gameStartOff()
		} else if (isMaxTurn(Board.getSize())) {
			Display.updateDrawText();
			Display.toggleResultText();
			gameStartOff();
		} else if (boardMarked) {
			changeTurnPlayer();
			incrementTurn();
		}
	}

	const startGame = (playerOneName, playerTwoName) => {
		setPlayerOne(playerOneName);
		setPlayerTwo(playerTwoName);
		Board.setBoard();
		resetTurnNumber();
		Display.showPlayerPositions(Board.getCells(), getPlayerOneName());
		Display.togglePlayerNameForm();
		Display.toggleNewGameButton();
		Display.enableBoard();
		gameStartOn();
	}

	const endGame = () => {
		Board.setBoard();
		gameStartOff();
		resetTurnNumber();
		Display.showPlayerPositions(Board.getCells(), getPlayerOneName());
		Display.togglePlayerNameForm();
		Display.toggleNewGameButton();
		Display.hideResultText();
		Display.disableBoard();
	}

	return {
		getPlayerOneName,
		getPlayerTwoName,
		getTurnPlayer,
		gameStartOn,
		gameStartOff,
		isGameStarted,
		progressGameState,
		startGame,
		endGame,
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
				Display.showPlayerPositions(GameBoard.getCells(), Game.getPlayerOneName());
			}
		});
	}

	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const data = new FormData(form);
		/* Consider moving this to its own function called startGame in Game module*/
		const playerOneName = data.get("player-one");
		const playerTwoName = data.get("player-two");
		Game.startGame(playerOneName, playerTwoName);
	});

	newGameButton.addEventListener("click", () => {
		Game.endGame();
	})
})
