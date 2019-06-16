import Game from "./game.js";

//set up constants
const GAME_WIDTH = 800; // in pixels
const GAME_HEIGHT = 600; // in pixels
const FPS = 30; //frames per second


// set up canvas
let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext('2d');


//create new gmae
let game = new Game(GAME_WIDTH, GAME_HEIGHT);


function draw(timeStamp){
	
	game.draw(ctx);
	requestAnimationFrame(draw);
}

function update(timeStamp){
	game.update();
	game.draw(ctx);
	requestAnimationFrame(update);
}


//requestAnimationFrame(draw);
requestAnimationFrame(update);








