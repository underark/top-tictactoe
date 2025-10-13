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
	const boardSize = 9;
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

	const checkLeftDiagonal = () => {
		const name = board[0].player;
		const jump = 4;
		const start = 0;
		const end = 8;
		let winnerFound = true;
		for (let i = start; i < end + 1; i += jump) {
			if (board[i].marked == false) {
				winnerFound = false;
			} else if (board[i].player !== name) {
				winnerFound = false;	
			} 
		}
		return winnerFound;
	}

	const checkRightDiagonal = () => {
		const name = board[2].player;
		const jump = 2;
		const start = 2;
		const end = 6;
		let winnerFound = true;
		for (let i = start; i < end + 1; i += jump) {
			if (board[i].marked == false) {
				winnerFound = false;
			} else if (board[i].player !== name) {
				winnerFound = false;	
			} 
		}
		return winnerFound;
	}

	const checkRows = () => {
		for (let r = 0; r < 2; r++) {
			let winnerFound = true;
			const name = board[r * 3].player;

			for (let t = 0; t < 3; t++) {
				console.log(board[r * 3 + t].player);
				if (board[r * 3 + t].player !== name) winnerFound = false;
			}

			if (winnerFound == true) return winnerFound;
		}
	}

	setBoard();
	return {
		showBoard,
		markBoard,
		checkLeftDiagonal,
		checkRightDiagonal,
		checkRows,
	}
})();

const game = (function(board) {
})(GameBoard);

const Alex = createPlayer("Alex");
const Peter = createPlayer("Peter");
GameBoard.markBoard(0, Alex.name);
GameBoard.markBoard(4, Alex.name);
GameBoard.markBoard(8, Peter.name);
console.log(GameBoard.checkRightDiagonal());
