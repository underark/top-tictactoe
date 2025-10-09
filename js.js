function createPlayer(name) {
	return {name};
}

const gameBoard = (function () {
	const boardSize = 9;
	const board = new Array(boardSize);

	const setBoard = () => {
		for (let i = 0; i < boardSize; i++) {
			board[i] = false;
		}
	}

	const showBoard = () => {
		console.log(board);
	}

	const markBoard = (position) => {
		if (position >= 0 && position <= boardSize) {
			board[position] = true;
		}
	}

	setBoard();
	return {
		showBoard,
		markBoard,
	}
})();

