export default class AI{

	constructor(game){
		this.game = game;
		this.positionsEvaluated = 0;

	}

	actionSpace(color, boardState = this.game.boardState.boardState){
		//return an array with all the posible action for the given color 
		let actionsArray = [];

		//cycle through all squares in board
		for(let i = 0; i < this.game.numFiles; i++){
			for(let j = 0; j < this.game.numRanks; j++){
				let piece = boardState[i][j];
				//if there is a piece and it is the color specified
				if(piece != 0 && piece.color == color){
					//cycle through every square in board and check if move is valid
					for(let k = 0; k < this.game.numFiles; k++){
						for(let l = 0; l < this.game.numRanks; l++){
							//if move to file-->k, rank-->l is valid
							let isMoveValid = piece.isMoveValid(k, l, boardState);

							//create test boardState where move is made
							let testBoardState = piece.testMove(k, l, boardState);

							//check to see if king is safe in test boardState
							let isKingSafe = false;
							if(isMoveValid){
								isKingSafe = this.game.isKingSafe(piece.color, testBoardState);
							}

							//if move is valid and the king is safe, add action to actions arrray
							if(isMoveValid && isKingSafe){
								actionsArray.push([piece, k, l]);
							}

						}
					}
				}
			}
		}
	return actionsArray;


	}

	evaluateBoard(color, boardState  = this.game.boardState.boardState){
		//evaluation function for the board
		//cycle through all squares in board

		let evalValue = 0;
		for(let i = 0; i < this.game.numFiles; i++){
			for(let j = 0; j < this.game.numRanks; j++){
				if(boardState[i][j].color == color){
					switch(boardState[i][j].name){
						case "Pawn":
							evalValue+=10;
							break;
						case "Knight":
							evalValue+=30;
							break;
						case "Bishop":
							evalValue+=30;
							break;
						case "Rook":
							evalValue+=50;
							break;
						case "Queen":
							evalValue+=90;
							break;
						case "King":
							evalValue+=900;
							break;
					}

				}else if(boardState[i][j].color != color){
					switch(boardState[i][j].name){
						case "Pawn":
							evalValue-=10;
							break;
						case "Knight":
							evalValue-=30;
							break;
						case "Bishop":
							evalValue-=30;
							break;
						case "Rook":
							evalValue-=50;
							break;
						case "Queen":
							evalValue-=90;
							break;
						case "King":
							evalValue-=900;
							break;
					}
				}
			}
		}
		return evalValue;

	}

	chooseBestMove(actionSpace, depth){
		
		actionSpace = this.shuffle(actionSpace);
		let bestMove = actionSpace[Math.floor(Math.random() * actionSpace.length)];
		let bestValue = -9999;

		for(let i = 0; i < actionSpace.length; i++){
			let move = actionSpace[i];
			let piece = move[0];
			let file = move[1];
			let rank = move[2];
			let testBoardState = piece.testMove(file, rank);
			//console.log(this.positionsEvaluated);
			
			//console.log("Current move: " + piece.name + " "+ file+" "+rank);
			let boardValue = this.minimax(depth, piece.color, false, -10000, 10000, testBoardState);
		
			//console.log("Current value: " + boardValue);
			if(boardValue > bestValue){
				bestValue = boardValue;
				bestMove = move;
			}
		
			
		}
		//console.log(this.positionsEvaluated);
		//console.log("Best: " + bestMove);
		//console.log("Best value: " + bestValue);
		
		this.positionsEvaluated = 0;
		return bestMove;
	}

	shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
	}

	minimax(depth, color, isMaximizing, alpha, beta, boardState = this.game.boardState.boardState){
		if(depth == 0){

			return this.evaluateBoard(color, boardState);

		}

		let actionSpace = this.actionSpace(color == "white"?"black":"white", boardState); 
		//debugger;
		
		if(isMaximizing){
			
			for(let i = 0; i < actionSpace.length; i++){
				let testBoardState = actionSpace[i][0].testMove(actionSpace[i][1],actionSpace[i][2], boardState)
				
				this.positionsEvaluated++;
				alpha = Math.max(alpha, 
					this.minimax(depth-1, color == "white"?"black":"white", !isMaximizing, alpha, beta, testBoardState));	
           		 if (beta <= alpha) {
                	break;
            	 }
			}	
			return alpha;
		}else {
			
			for(let i = 0; i < actionSpace.length; i++){
				let testBoardState = actionSpace[i][0].testMove(actionSpace[i][1],actionSpace[i][2], boardState);
				this.positionsEvaluated++;
				beta = Math.min(beta, 
					this.minimax(depth-1, color == "white"?"black":"white", !isMaximizing, alpha, beta, testBoardState));
           		 if (beta <= alpha) {
                	break;
            	 }
            	 
			}
			return beta;
		}
	
	}



}
