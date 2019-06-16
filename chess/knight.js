import Piece from "./piece.js";

const BLACK_KNIGHT_X_OFFSET = 3.5;
const BLACK_KNIGHT_Y_OFFSET = 6.5;

const WHITE_KNIGHT_X_OFFSET = 4.5;
const WHITE_KNIGHT_Y_OFFSET = 4;

export default class Knight extends Piece{

	constructor(game, color, file, rank){

		super(game, file, rank, color);
		this.name = "Knight";
		this.image = document.getElementById(color + "_knight");

		//offsets from the upper left corner of square
		if(color == "black"){
			this.xOffset = BLACK_KNIGHT_X_OFFSET; 
			this.yOffset = BLACK_KNIGHT_Y_OFFSET;
		} else {
			this.xOffset = WHITE_KNIGHT_X_OFFSET;
			this.yOffset = WHITE_KNIGHT_Y_OFFSET;
		}
	}

	isMoveValid(file, rank, boardState = this.game.boardState.boardState){

		let isMovingInL = this.isMovingInL(file, rank);
		let isFriendlyFire = this.isFriendlyFire(file, rank, boardState);

		return isMovingInL && !isFriendlyFire;
	}

	isMovingInL(file, rank){
	

		//check that move is in L shape
		if( (Math.abs(file-this.file) ==2 && Math.abs(rank-this.rank) == 1) ||
			(Math.abs(rank-this.rank) ==2 && Math.abs(file-this.file) == 1)){
			return true;
		}
		return false;
	}


	isFriendlyFire(file, rank, boardState){
		//return true is there is a friendly piece in the destination
		if(boardState[file][rank] != 0){
			return this.color == boardState[file][rank].color;
		}

		return false;
		
	}

}