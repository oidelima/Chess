import Piece from "./piece.js";

const BLACK_QUEEN_X_OFFSET = 5.5;
const BLACK_QUEEN_Y_OFFSET = 5.5;

const WHITE_QUEEN_X_OFFSET = 5.5;
const WHITE_QUEEN_Y_OFFSET = 5;

export default class Queen extends Piece{

	constructor(game, color, file, rank){

		super(game, file, rank, color);
		this.name = "Queen";
		this.image = document.getElementById(color + "_queen");
		//offsets from the upper left corner of square
		if(color == "black"){
			this.xOffset = BLACK_QUEEN_X_OFFSET; 
			this.yOffset = BLACK_QUEEN_Y_OFFSET;
		} else {
			this.xOffset = WHITE_QUEEN_X_OFFSET;
			this.yOffset = WHITE_QUEEN_Y_OFFSET;
		}
	}

	isMoveValid(file, rank, boardState = this.game.boardState.boardState){

		let isDiagonal = Math.abs(file - this.file) == Math.abs(rank - this.rank);
		let isSameRankOrFile = file == this.file || rank == this.rank;
		let isPieceInTheWay = this.isPieceInTheWay(file, rank, boardState);
		let isFriendlyFire = this.isFriendlyFire(file, rank, boardState);
		

		return (isDiagonal || isSameRankOrFile) && !isPieceInTheWay &&
		 !isFriendlyFire;
	}


	isFriendlyFire(file, rank, boardState){
		//return true is there is a friendly piece in the destination
		if(boardState[file][rank] != 0){
			return this.color == boardState[file][rank].color;
		}

		return false;
		
	}

	isPieceInTheWay(file, rank, boardState){
		//check if there is a white or black piece up to but not including the destination
		if(Math.abs(file - this.file) == Math.abs(rank - this.rank)){
			if(file > this.file && rank > this.rank){ //moving diagonally to upper right
			for(let i = 0; i < Math.abs(rank - this.rank) - 1; i++){

				if(boardState[this.file + 1 + i][this.rank + 1 + i] != 0){
					return true;
				}
			}
		} else if(file > this.file && rank < this.rank){ //moving diag lower right
			for(let i = 0; i < Math.abs(rank - this.rank) - 1; i++){
				if(boardState[this.file + 1 + i][this.rank -1 - i] != 0){
					return true;
				}
			}
		}else if(file < this.file && rank > this.rank){ //moving  diag upper left
			for(let i = 0; i < Math.abs(rank - this.rank) - 1; i++){
				if(boardState[this.file - 1 - i][this.rank + 1 + i] != 0){
					return true;
				}
			}
		}else if(file < this.file && rank < this.rank){ //moving diag lower left
			for(let i = 0; i < Math.abs(rank - this.rank) - 1; i++){
				if(boardState[this.file - 1 - i][this.rank - 1 - i] != 0){
					return true;
				}
			}
		}	
		}
		
		if(file == this.file && rank > this.rank){ //moving straight up
			for(let i = 0; i < Math.abs(rank - this.rank) - 1; i++){
				if(boardState[this.file][this.rank + 1 + i] != 0){
					return true;
				}
			}
		} else if(file == this.file && rank < this.rank){ //moving straight down
			for(let i = 0; i < Math.abs(rank - this.rank) - 1; i++){
				if(boardState[this.file][this.rank -1 - i] != 0){
					return true;
				}
			}
		}else if(rank == this.rank && file > this.file){ //moving straight right
			for(let i = 0; i < Math.abs(file - this.file) - 1; i++){
				if(boardState[this.file + 1 + i][this.rank] != 0){
					return true;
				}
			}
		}else if(rank == this.rank && file < this.file){ //moving straight left
			for(let i = 0; i < Math.abs(file - this.file) - 1; i++){
				if(boardState[this.file - 1 - i][this.rank] != 0){
					return true;
				}
			}
		}
		return false;
		
	}

}