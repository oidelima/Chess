import Piece from "./piece.js";

const LONG_CASTLING = -1;//number used to determine step direction when castling
const SHORT_CASTLING = 1;

const BLACK_ROOK_X_OFFSET = 5.5;
const BLACK_ROOK_Y_OFFSET = 6.5;

const WHITE_ROOK_X_OFFSET = 4;
const WHITE_ROOK_Y_OFFSET = 4;

export default class Rook extends Piece{

	constructor(game, color, file, rank){

		super(game, file, rank, color);
		this.name = "Rook";
		this.image = document.getElementById(color + "_rook");

		//offsets from the upper left corner of square
		if(color == "black"){
			this.xOffset = BLACK_ROOK_X_OFFSET; 
			this.yOffset = BLACK_ROOK_Y_OFFSET;
		} else {
			this.xOffset = WHITE_ROOK_X_OFFSET;
			this.yOffset = WHITE_ROOK_Y_OFFSET;
		}
	}

	isMoveValid(file, rank, boardState = this.game.boardState.boardState){

		let isSameRankOrFile = file == this.file || rank == this.rank;
		let isPieceInTheWay = this.isPieceInTheWay(file, rank, boardState);
		let isFriendlyFire = this.isFriendlyFire(file, rank, boardState);

		return isSameRankOrFile && !isPieceInTheWay && !isFriendlyFire ;
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

		if(file == this.file && rank > this.rank){ //moving up
			for(let i = 0; i < Math.abs(rank - this.rank) - 1; i++){
				if(boardState[this.file][this.rank + 1 + i] != 0){
					return true;
				}
			}
		} else if(file == this.file && rank < this.rank){ //moving down
			for(let i = 0; i < Math.abs(rank - this.rank) - 1; i++){
				if(boardState[this.file][this.rank -1 - i] != 0){
					return true;
				}
			}
		}else if(rank == this.rank && file > this.file){ //moving right
			for(let i = 0; i < Math.abs(file - this.file) - 1; i++){
				if(boardState[this.file + 1 + i][this.rank] != 0){
					return true;
				}
			}
		}else if(rank == this.rank && file < this.file){ //moving left
			for(let i = 0; i < Math.abs(file - this.file) - 1; i++){
				if(boardState[this.file - 1 - i][this.rank] != 0){
					return true;
				}
			}
		}
		return false;
		
	}

	isCastling(boardState = this.game.boardState.boardState){

		//find king
		let king = this.game.findPiece("King", this.color, boardState);

		//declare test boardState
		let testBoardState = [];

		//declare castling type (1 for short, -1 for long)
		let castlingType = 0; //number used to determine direction of castling
		if(this.file == 3) castlingType = LONG_CASTLING;
		else if(this.file == 5) castlingType = SHORT_CASTLING;
	

		//check to see if a castling move can be made

		if(this.moveNumber == 1 && castlingType != 0 && king.moveNumber == 0){
			//move one step to the left
			testBoardState = king.testMove(this.file, this.rank, boardState);
			//check to see if king is safe in first move
			let firstMoveSafe = this.game.isKingSafe(this.color, testBoardState);
			//get new king
			king = this.game.findPiece("King", this.color, testBoardState);
			//move another step to left
			testBoardState = king.testMove(this.file + castlingType, this.rank, testBoardState);
			//check to see if king is safe in second move
			let secondMoveSafe = this.game.isKingSafe(this.color, testBoardState);
			//return true if valid castling
			return firstMoveSafe && secondMoveSafe;
		}


		return false;

	}




}
