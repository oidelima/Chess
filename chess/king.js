import Piece from "./piece.js";

const BLACK_KING_X_OFFSET = 4.7;
const BLACK_KING_Y_OFFSET = 5.5;

const WHITE_KING_X_OFFSET = 5.25;
const WHITE_KING_Y_OFFSET = 5;

export default class King extends Piece{

	constructor(game, color, file, rank){

		super(game, file, rank, color);
		this.name = "King";
		this.image = document.getElementById(color + "_king");

		//offsets from the upper left corner of square
		if(color == "black"){
			this.xOffset = BLACK_KING_X_OFFSET; 
			this.yOffset = BLACK_KING_Y_OFFSET;
		} else {
			this.xOffset = WHITE_KING_X_OFFSET;
			this.yOffset = WHITE_KING_Y_OFFSET;
		}
	}

	isMoveValid(file, rank, boardState = this.game.boardState.boardState){

		let isOneStep = Math.abs(file - this.file) <= 1 && Math.abs(rank - this.rank) <= 1;
		let isFriendlyFire = this.isFriendlyFire(file, rank, boardState);
		return isOneStep && !isFriendlyFire ;
	}



	isFriendlyFire(file, rank, boardState){
		//return true is there is a friendly piece in the destination
		if(boardState[file][rank] != 0){
			return this.color == boardState[file][rank].color;
		}

		return false;
		
	}

}