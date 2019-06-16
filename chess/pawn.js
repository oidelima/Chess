import Piece from "./piece.js";

const BLACK_PAWN_X_OFFSET = 3.5;
const BLACK_PAWN_Y_OFFSET = 5;

const WHITE_PAWN_X_OFFSET = 4.5;
const WHITE_PAWN_Y_OFFSET = 4;

export default class Pawn extends Piece{

	constructor(game, color, file, rank){
		super(game, file, rank, color);
		this.name = "Pawn";
		this.image = document.getElementById(color + "_pawn");

		//offsets from the upper left corner of square
		if(color == "black"){
			this.xOffset = BLACK_PAWN_X_OFFSET; 
			this.yOffset = BLACK_PAWN_Y_OFFSET;
		} else {
			this.xOffset = WHITE_PAWN_X_OFFSET;
			this.yOffset = WHITE_PAWN_Y_OFFSET;
		}
	
	}

	isMoveValid(file, rank, boardState = this.game.boardState.boardState){

		let isOneAhead = this.isNAhead(file, rank, 1); //is the piece moving one step ahead
		let isTwoAhead = this.isNAhead(file, rank, 2); //or two steps ahead
		let isPieceInTheWay = this.isPieceInTheWay(file, rank, boardState);  //is there a piece in the way
		let isEatingDiagonally = this.isEatingDiagonally(file, rank, boardState); //is the pawn eating diagonally
	
		return ((isOneAhead || (isTwoAhead && this.moveNumber == 0)) && 
			!isPieceInTheWay) || isEatingDiagonally;
	}

	isNAhead(file, rank, n){
		//return to check if move is n steps ahead
		if(this.color == "white") return file == this.file && rank == this.rank + n;
		else if(this.color == "black") return file == this.file && rank == this.rank - n;
	}

	isPieceInTheWay(file, rank, boardState){
		//return true if there is a piece in the way IF MOVING STRAIGHT AHEAD NOT DIAGONALLY!

		if(this.color == "white"){
			for(let i = 0; i < rank - this.rank; i++){
				if(boardState[this.file][this.rank + 1 + i] != 0){
					return true;
				}
			}
		} else if(this.color == "black"){
			for(let i = 0; i < this.rank - rank; i++){
				if(boardState[this.file][this.rank - 1 - i] != 0){
					return true;
				}
			}
		}
		
		return false;
	}

	isEatingDiagonally(file, rank, boardState){
		//return true if pawn is eating diagonally
		if(this.color == "white"){
			if(rank == this.rank+1 &&
			(file == this.file + 1 || file == this.file - 1) &&
			boardState[file][rank].color == "black"){
				return true;
			}	
		} else if(this.color == "black"){
			if(rank == this.rank-1 &&
			(file == this.file+1 || file == this.file-1) &&
			boardState[file][rank].color == "white"){
				return true;
			}	
		}

		return false;
		
	}

	hasReachedEnd(boardState = this.game.boardState.boardState){
		//if the pawn reached the oposite end of board, switch for a queen
		
		if(this.color == "white" && this.rank == 7){
			return true;
		} else if (this.color == "black" && this.rank == 0){
			return true;
		}
		return false;
	}

}