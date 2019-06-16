

export default class Piece{

	constructor(game, file, rank, color){
		this.game = game;
		this.file = file;
		this.rank = rank;
		this.width = game.boardSize/10;
		this.height = game.boardSize/10;
		this.position = game.locs[file][rank];
		this.color = color;
		this.moveNumber = 0; //how many moves has the piece made
	}

	move(file, rank,  boardState = this.game.boardState.boardState){

		//allows you to move any piece in any boardState

		//update board state
		boardState[this.file][this.rank] = 0; 
		boardState[file][rank] = this;

		//update piece variables
		this.file = file;
		this.rank = rank;
		this.position =  this.game.locs[file][rank];		

	}

	testMove(file, rank, boardState = this.game.boardState.boardState){
		//creates a deep copy of the board passed, makes a move in this copy 
		//and returns the resulting board


		//make copy of board
		let boardStateCopy = this.game.boardState.deepCloneBoardState(boardState);

		//get copy of piece
		let pieceCopy = boardStateCopy[this.file][this.rank];


		//move piece copy
		pieceCopy.move(file, rank, boardStateCopy);

		return boardStateCopy;
	}



	draw(ctx){
		ctx.drawImage(this.image, this.position.x + this.xOffset, 
			this.position.y + this.yOffset, this.width, this.height);
	}
}