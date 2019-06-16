import {GAMESTATE} from "./game.js";

export default class Menu{


	constructor(game){
		this.game = game;
		this.gameWidth = game.gameWidth;
		this.gameHeight = game.gameHeight;
		this.selecting = 1;//player selected 
	}

	draw(ctx){
		
		//draw menu background
		ctx.rect(0, 0, this.gameWidth, this.gameHeight);
		ctx.fillStyle = "rgba(0, 0, 0, 1)";
		ctx.fill();

		//drawing CHESS title
		ctx.font = "40px Arial";
		ctx.fillStyle = "white";
	    ctx.textAlign = "center";
	    ctx.fillText("CHESS", this.gameWidth/2, this.gameHeight/4);

		//draw player 1
	    this.drawPlayer(1, ctx);

	    //draw player 2
	    this.drawPlayer(2, ctx);
	}

	changePlayer(){

		//change from human player to ai
		if(this.selecting == 1){

			if (this.game.player1 == "Player 1") this.game.player1 ="AI";
			else if(this.game.player1 == "AI") this.game.player1 ="Player 1";
		}

		if(this.selecting == 2){
			if (this.game.player2 == "Player 2") this.game.player2 = "AI";
			else if(this.game.player2 == "AI") this.game.player2 = "Player 2";
		}

	}

	drawPlayer(playerNum, ctx){
		//draw a player in screen
		ctx.font = "30px Arial";
	    ctx.textAlign = "center";

	    if(playerNum == 1){
	    	if(this.selecting == 1){
	    		ctx.fillStyle = "red";
	    	} else {
	    		ctx.fillStyle = "white";
	    	}

	   		//drawing player 1
			ctx.fillText(this.game.player1, this.gameWidth/4, this.gameHeight/2);
	    }

	     if(playerNum == 2){
	    	if(this.selecting == 2){
	    		ctx.fillStyle = "red";
	    	} else {
	    		ctx.fillStyle = "white";
	    	}

	   		//drawing player 2
			ctx.fillText(this.game.player2, 3*this.gameWidth/4, this.gameHeight/2);
	    }
	    

	}

	selectPlayer(){
		if(this.selecting == 1){

			this.selecting = 2;
			
		} else {

			//reset menu
			this.selecting = 1;

			//start game
			this.startGame();
		}
	}

	startGame(){
		//change gamestate
		this.game.gameState = GAMESTATE.PLAYING;
	
	}

}