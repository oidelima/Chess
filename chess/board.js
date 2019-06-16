export default class Board{

	constructor(game){
		this.game = game;
		this.image = document.getElementById("chess_board");
		this.size = game.boardSize; 
		this.position = {
			x: this.game.gameWidth/2 - this.size/2,
			y: this.game.gameHeight/2 - this.size/2
		};
	}

	draw(ctx){
		ctx.drawImage(this.image, this.position.x, this.position.y, this.size, this.size);
	}
}