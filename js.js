function createPlayer(name) {
	return {name};
}

const gameBoard = (function () {
	const boardSize = 9;
	const board = new Array(boardSize);

	const showBoard = () => {
		console.log(board);
	}

	const setBoard = () => {
		for (let i = 0; i < boardSize; i++) {
			board[i] = false;
		}
	}

	setBoard();
	return {
		showBoard,
	}
})();

gameBoard.showBoard();