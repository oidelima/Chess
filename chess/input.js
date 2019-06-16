import {GAMESTATE} from "./game.js";

export default class InputHandler{
	constructor(game){

		this.game = game;
		let click = false; //boolean to check if user is currently clicking or not
		let piece = 0; //piece selected to move

		document.addEventListener("mousedown", (event) => {
			click = true;

			//if it's white's turn and the piece is white, pick it up
			if(this.game.turnNumber % 2 == 0 && 
				this.selectPiece(event).color == "white" &&
				this.game.player1 != "AI"){
				piece = this.selectPiece(event);
			}

			//if it's black's turn and the piece is black, pick it up
			if(this.game.turnNumber % 2 == 1 && 
				this.selectPiece(event).color == "black" &&
				this.game.player2 != "AI"){
				piece = this.selectPiece(event);
			}
			
		})

		document.addEventListener("mousemove", (event) => {

			//find piece where user clicked
			if(click && piece != 0) {
				//change position of piece according to mouse position
				piece.position = {x: event.pageX - piece.width/2, y: event.pageY - piece.height/2};
				
			}

		})

		document.addEventListener("mouseup", (event) => {
			click = false;

			//Location where mouse is unclicked
			let dropoffLoc = this.getDropoffLoc(event);
			let file = dropoffLoc[0]; //file where piece is trying to move
			let rank = dropoffLoc[1]; //rank where piece is trying to move

			//make move
			this.game.turn(piece, file, rank);


			//reset piece
			piece = 0;
		
		})	


		document.addEventListener("keydown", (event) => {
			if(this.game.gameState == GAMESTATE.MENU){
				switch(event.keyCode){
					case 13://enter select player
						this.game.menu.selectPlayer();
						break;
					case 38: //change player (arrow up)
						this.game.menu.changePlayer();
						break;
					case 40: //change player (arrow down)
						this.game.menu.changePlayer();
						break;
				}	
			}else if(this.game.gameState == GAMESTATE.GAMEOVER){ 
				//if pressed enter
				if(event.keyCode == 13) {
					this.game.newGame();
					this.game.gameState = GAMESTATE.MENU;
				}
					

			}
			
		})

	
	}


	getDropoffLoc(event){
		//return location where piece will drop off
		let boardLocs = this.game.locs; // all game locations
		for (let file = 0; file < this.game.numFiles; file++){
			for(let rank = 0; rank < this.game.numRanks; rank++){
				if(event.pageX > boardLocs[file][rank].x && 
					event.pageX < boardLocs[file][rank].x + this.game.squareSize &&
					event.pageY > boardLocs[file][rank].y && 
					event.pageY < boardLocs[file][rank].y + this.game.squareSize ){

					return [file, rank];
				}
			}
		}
		return 0;
	}

	selectPiece(event){
		//select piece where user clicked
		let boardLocs = this.game.locs;
		for (let file = 0; file < this.game.numFiles; file++){
			for(let rank = 0; rank < this.game.numRanks; rank++){
				if(event.pageX > boardLocs[file][rank].x && 
					event.pageX < boardLocs[file][rank].x + this.game.squareSize &&
					event.pageY > boardLocs[file][rank].y && 
					event.pageY < boardLocs[file][rank].y + this.game.squareSize ){

					return this.game.boardState.boardState[file][rank];
				}
			}
		}
		return 0;
	}



}