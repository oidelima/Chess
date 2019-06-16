import Board from "./board.js";
import BoardState from "./boardState.js";
import InputHandler from "./input.js";
import Queen from "./queen.js";
import Menu from "./menu.js";
import AI from "./ai.js";


//declare constants
const BOARD_SIZE = 400; //size in pxls of side of board
const LOC_FONT_SIZE = 30;
const LOC_LETTER_WIDTH = 18;
const GAME_OVER_FONT_SIZE = 40;
const NUM_RANKS = 8; //number of ranks in board
const NUM_FILES = 8; //number of files in board
const MOVES_TO_DRAW = 50; //consecutive moves need with capture or pawn move to draw
export const GAMESTATE = {
	PLAYING: 1,
	MENU: 2,
	GAMEOVER: 3,
}



export default class Game {

	constructor(gameWidth, gameHeight){
		this.gameWidth = gameWidth;
		this.gameHeight = gameHeight;
		this.numFiles = NUM_FILES;
		this.numRanks = NUM_RANKS;
		this.boardSize = BOARD_SIZE;
		this.squareSize = Math.round(this.boardSize/8);
		this.board = new Board(this);
		this.locs = this.generateLocs(); //generates an object of all locations in board
		this.boardState = new BoardState(this);
		this.turnNumber = 0; //even turn numbers are white, odd are black
		this.menu = new Menu(this);
		this.lastWinner = ""//who won the last game
		this.gameState = GAMESTATE.MENU;
		this.movesToDraw = MOVES_TO_DRAW; //moves remaining without capture or pawn move to draw
		this.ai = new AI(this);
		this.player1 = "Player 1";
		this.player2 = "Player 2";
		new InputHandler(this);
		

	}

	//generates a 2d array of 8x8 objects containing the square positions of the board
	generateLocs(){
		let locs = [];
		for (let file = 0; file < NUM_FILES; file++){
			locs.push([]);
			for (let rank = 0; rank < NUM_RANKS; rank++){
				locs[file][rank] = {
					x: this.gameWidth/2 - (4-file)*this.squareSize ,
					y: this.gameHeight/2 + (3 - rank)*this.squareSize
				}
			}
		}	
		return locs;
	}

	drawBoard(ctx){

		ctx.clearRect(0, 0, this.gameWidth, this.gameHeight);
		this.board.draw(ctx);
		this.drawLocationText(ctx);
		this.boardState.draw(ctx);
	
	}
	draw(ctx){
		if(this.gameState == GAMESTATE.PLAYING){
			this.drawBoard(ctx);
		}else if(this.gameState == GAMESTATE.MENU){
			this.menu.draw(ctx);
		}else if(this.gameState == GAMESTATE.GAMEOVER){
			this.drawBoard(ctx);
			this.drawGameOver(ctx);
		}
	}

	//draws the game
	update(){


		if(this.gameState == GAMESTATE.PLAYING){

			//if player1 is AI make move
			if(this.turnNumber % 2 == 0 &&
				this.player1 == "AI"){
				this.aiTurn("white");
			}else if(this.turnNumber % 2 == 1 &&  //if player2 is AI make move
				this.player2 == "AI"){
				this.aiTurn("black");

			}
		} 
		
	}


	//draws the file lettering and rank numbering
	drawLocationText(ctx){
		ctx.font = LOC_FONT_SIZE + "px Arial";
		ctx. fillStyle = "black";
		ctx.textAlign = "left";
		for(let i = 0; i < NUM_RANKS; i++){
			//draw file letters (a-h)
			ctx.fillText(String.fromCharCode(97 + i), this.gameWidth/2 - (3.5-i)*this.squareSize - LOC_LETTER_WIDTH/2, 
		 		this.gameHeight/2 + 4.5*this.squareSize); //97 is the ascii code for "a"

			//draw rank numbers (1-8)
			ctx.fillText(i + 1, this.gameWidth/2 - 4.5*this.squareSize, 
				this.gameHeight/2 + (3.5-i)*this.squareSize + LOC_LETTER_WIDTH/2);

		}
	}

	drawGameOver(ctx){
		ctx.font = GAME_OVER_FONT_SIZE + "px Arial";
		ctx. fillStyle = "black";
		ctx.textAlign = "center";
		if(this.lastWinner != "draw"){
			ctx.fillText(this.lastWinner.toUpperCase() + " WINS", this.gameWidth/2, this.gameHeight/9.5);
		} else{
			ctx.fillText( "DRAW", this.gameWidth/2, this.gameHeight/9.5);
		}
		ctx.font = GAME_OVER_FONT_SIZE-20 + "px Arial";
		ctx.fillText("PRESS ENTER FOR NEW GAME", this.gameWidth/2, this.gameHeight/7);
		
	}

	findPiece(name, color, boardState = this.boardState.boardState){
		for(let i = 0; i < this.numFiles; i++){
			for(let j = 0; j < this.numRanks; j++){
				if(boardState[i][j].name == name &&
					boardState[i][j].color == color){
					return boardState[i][j];
				}
			}
		}
	}

	isKingSafe(color, boardState = this.boardState.boardState){
		//check if your king is safe when making a move to the given file and rank

		
		//find king
		let king = this.findPiece("King", color, boardState);

		//check if any piece in the board can kill the king with a valid move
		for(let i = 0; i < this.numFiles; i++){
			for(let j = 0; j < this.numRanks; j++){
				if(boardState[i][j] != 0){
					if(boardState[i][j].isMoveValid(king.file, king.rank, boardState)){
						return false;
					}
				}
				
			}
		}
		return true;
	}

	aiTurn(color){

		//implement how the ai behaves 

		//evaluation of position in board
		let boardEval = this.ai.evaluateBoard(color);

		//create an array with all posible valid moves for color 
		let actionSpace = this.ai.actionSpace(color);
		let action = this.ai.chooseBestMove(actionSpace, 2);


		if(action != undefined){
			let piece = action[0];
			let file = action[1];
			let rank = action[2];

			//update moves to draw
			if(this.boardState.boardState[file][rank] != 0 || piece.name == "Pawn"){
			this.movesToDraw = MOVES_TO_DRAW;
			}else{
				this.movesToDraw--;
			}
		

			//move piece
			piece.move(file, rank);
			
			//increment number of moves of piece
			piece.moveNumber++;
		
			//if pawn gets to end, switch for queen
			if(piece.name == "Pawn" && piece.hasReachedEnd()) {
				piece = new Queen(this, piece.color, file, rank);
			    this.boardState.boardState[file][rank] = piece;
			}

			//if rook is castling, move king too
			if(piece.name == "Rook" && piece.isCastling()){
				let king = this.findPiece("King", piece.color);
				if(piece.file == 3) king.move(2,piece.rank);
				else if (piece.file == 5) king.move(6,piece.rank);
			}




			//increment turn number
			this.turnNumber++;


			//handle checkmate
			if(this.isCheckmated(color == "white"? "black": "white")){
				this.gameOver(color);
			}

			//handle draw
			if(this.movesToDraw == 0){
				this.gameOver("draw");
			}

		}
		
	}

	turn(piece, file, rank){
		if(piece != 0 && file != undefined) {

			//check if given move is valid
			let isMoveValid = piece.isMoveValid(file, rank);

			//create test boardState where move is made
			let testBoardState = piece.testMove(file, rank);

			//check to see if king is safe in test boardState
			let isKingSafe = false;
			if(isMoveValid){
				isKingSafe = this.isKingSafe(piece.color, testBoardState);
			}

			if(isMoveValid && isKingSafe){

				//update moves to draw
				if(this.boardState.boardState[file][rank] != 0 || piece.name == "Pawn"){
					this.movesToDraw = MOVES_TO_DRAW;
				}else{
					this.movesToDraw--;
				}

				//move piece
				piece.move(file, rank);

				//increment number of moves of piece
				piece.moveNumber++;
					
				//if pawn gets to end, switch for queen
				if(piece.name == "Pawn" && piece.hasReachedEnd()) {
					piece = new Queen(this, piece.color, file, rank);
				    this.boardState.boardState[file][rank] = piece;
				}

				//if rook is castling, move king too
				if(piece.name == "Rook" && piece.isCastling()){
					let king = this.findPiece("King", piece.color);
					if(piece.file == 3) king.move(2,piece.rank);
					else if (piece.file == 5) king.move(6,piece.rank);
				}


				//increment turn number
				this.turnNumber++;
						
			} else { //if move is not valid return to prev location
				if(piece) piece.position = this.locs[piece.file][piece.rank];
			}
		} else { //if dropoff loc is not valid return to prev location
			if(piece) piece.position = this.locs[piece.file][piece.rank];	
		}

		//handle checkmate
		if(this.isCheckmated(piece.color == "white"? "black": "white")){
			this.gameOver(piece.color);
		}

		//handle draw
		if(this.movesToDraw == 0){
			this.gameOver("draw");
		}


	
	}

	gameOver(whoWon){
		this.gameState = GAMESTATE.GAMEOVER;
		this.lastWinner = whoWon;
		this.turnNumber = 0;
		this.movesToDraw = MOVES_TO_DRAW; 
	}

	newGame(){
		this.boardState = new BoardState(this);
	}

	isCheckmated(color, boardState = this.boardState.boardState){
		//return true if checkmate has ocurred

		//find king
		let king = this.findPiece("King", color, boardState);

		//variable to check if king is safe
		let isKingSafe = this.isKingSafe(color, boardState);

		if(isKingSafe) return false;
		else{
			for(let i = 0; i < this.numFiles; i++){
				for(let j = 0; j < this.numRanks; j++){
					let piece = boardState[i][j];
					if(piece != 0 && piece.color == color){
						for(let k = 0; k < this.numFiles; k++){
							for(let l = 0; l < this.numRanks; l++){
								//check if given move is valid
								let isMoveValid = piece.isMoveValid(k, l);

								//create test boardState where move is made
								let testBoardState = piece.testMove(k, l);

								//check to see if king is safe in test boardState
								let isKingSafe = false;
								if(isMoveValid){
									isKingSafe = this.isKingSafe(piece.color, testBoardState);
									if(isKingSafe) return false;
								}
							}
						}
					}
				}
			}
		}

		return true;
	
	}
	

}