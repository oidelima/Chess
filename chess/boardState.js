import Pawn from "./pawn.js";
import Knight from "./knight.js";
import Rook from "./rook.js";
import Bishop from "./bishop.js";
import Queen from "./queen.js";
import King from "./king.js";

const NUM_RANKS = 8; //number of ranks in board
const NUM_FILES = 8; //number of files in board

export default class BoardState{

	constructor(game){
		this.game = game;
		this.boardState = this.createEmptyBoardState();
		this.initializeBoardState();
	}

	initializeBoardState(){

		//initialize game pieces
		this.initializePawns();
		this.initializeBishops();
		this.initializeRooks();
		this.initializeKnights();
		this.initializeQueens();
		this.initializeKings();
	}

	deepCloneBoardState(boardState = this.boardState){

		let boardStateClone = this.createEmptyBoardState();

		for(let i = 0; i < this.game.numFiles; i++){
			for(let j = 0; j < this.game.numRanks; j++){
				if(boardState[i][j] != 0){
					let color = boardState[i][j].color;
					let file = boardState[i][j].file;
					let rank = boardState[i][j].rank;
					let moveNumber = boardState[i][j].moveNumber;
					switch(boardState[i][j].constructor.name){
						case "Pawn":
							boardStateClone[i][j] = new Pawn(this.game, color, file, rank);
							break;
						case "Rook":
							boardStateClone[i][j] = new Rook(this.game, color, file, rank);
							break;
						case "Knight":
							boardStateClone[i][j] = new Knight(this.game, color, file, rank);
							break;
						case "Bishop":
							boardStateClone[i][j] = new Bishop(this.game, color, file, rank);
							break;
						case "Queen":
							boardStateClone[i][j] = new Queen(this.game, color, file, rank);
							break;
						case "King":
							boardStateClone[i][j] = new King(this.game, color, file, rank);
							break;

					}

					//update the move number of clone piece
					boardStateClone[i][j].moveNumber = moveNumber;
					
				}	
			}
		}

		return boardStateClone;
	}

	createEmptyBoardState(){
		//create 8x8 array with "null" values representing board
		let boardState = []
		for (let file = 0; file < NUM_FILES; file++){
			boardState.push([]);
			for (let rank = 0; rank < NUM_RANKS; rank++){
				boardState[file].push(0);
			}
		}	
		return boardState;
	}

	initializePawns(){
		for (let file = 0; file < NUM_FILES; file++){
			//adding white pawns
			this.boardState[file][1] = new Pawn(this.game, "white", file, 1);
			//adding black pawns
			this.boardState[file][6] = new Pawn(this.game, "black", file, 6); 
		}
	}

	initializeBishops(){

		//initializing white bishops
		this.boardState[2][0] = new Bishop(this.game, "white", 2, 0); 
		this.boardState[5][0] = new Bishop(this.game, "white", 5, 0); 
		//initializing black bishops
		this.boardState[2][7] = new Bishop(this.game, "black", 2, 7); 
		this.boardState[5][7] = new Bishop(this.game, "black", 5, 7); 
		
	}

	initializeRooks(){

		//initializing white rooks
		this.boardState[0][0] = new Rook(this.game, "white", 0, 0); 
		this.boardState[7][0] = new Rook(this.game, "white", 7, 0); 
		//initializing black rookss
		this.boardState[0][7] = new Rook(this.game, "black", 0, 7); 
		this.boardState[7][7] = new Rook(this.game, "black", 7, 7); 
	}

	initializeKnights() {
		//initializing white knights
		this.boardState[1][0] = new Knight(this.game, "white", 1, 0); 
		this.boardState[6][0] = new Knight(this.game, "white", 6, 0); 
		//initializing black knights
		this.boardState[1][7] = new Knight(this.game, "black", 1, 7); 
		this.boardState[6][7] = new Knight(this.game, "black", 6, 7); 
	}

	initializeQueens(){
		this.boardState[3][0] = new Queen(this.game, "white", 3, 0);
		this.boardState[3][7] = new Queen(this.game, "black", 3, 7);
	}

	initializeKings(){
		this.boardState[4][0] = new King(this.game, "white", 4, 0);
		this.boardState[4][7] = new King(this.game, "black", 4, 7);
	}

	draw(ctx){
		//draw every piece currently in the board
		for (let file = 0; file < NUM_FILES; file++){
			for (let rank = 0; rank < NUM_RANKS; rank++){
				if(this.boardState[file][rank]){
					this.boardState[file][rank].draw(ctx);
				} 
			}
		}	
	}



}
