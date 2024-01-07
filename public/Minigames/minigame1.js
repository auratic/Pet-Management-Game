
const blockTile = {
   E: "E.png", EN: "EN.png", ES: "ES.png", ESN: "ESN.png", ESW: "ESW.png", ESWN: "ESWN.png", EW: "EW.png", EWN: "EWN.png", N: "N.png", S: "S.png", SN: "SN.png", SW:"SW.png", SWN: "SWN.png", W: "W.png", WN: "WN.png"
}

const mazeSize = 5;

const gameContainer = document.getElementById("game-container");
const blockSize = $('#game-container').width() / mazeSize;
const playerSize = blockSize / 2;
const playerSpeed = 6;
console.log(blockSize)

var gameMode = "keyboard";
var gameState = 1

class Maze {
   constructor (mazeSize, blockSize, blockTile, x, y, direction) {
      console.log(mazeSize);
      this.mazeSize = mazeSize
      this.blockSize = blockSize
      this.x = x
      this.y = y
      this.direction = direction
      this.file = blockTile

   }

   generateBlock () {
      return `
         <div class="maze-block ${this.direction}" id="x${this.x}y${this.y}"
                  style="
                  width: ${this.blockSize};  
                  height: ${this.blockSize};
                  background: url('./Assets/Tile/${this.file}') no-repeat;
                  background-size: contain;
                  image-rendering: pixelated"
         >
         </div>`;
   }

   collision () {
      
   }
}

class Player {

   constructor () {
      
      this.x = 500,
      this.y = 100,
      this.width = 50,
      this.height = 50
      this.velocityX = 0;
      this.velocityY = 0;

   }

   draw () {
      this.x += this.velocityX;
      this.y += this.velocityY;
      return `<div style="
                  position: absolute; 
                  top: ${this.y}; left: ${this.x}; 
                  width: ${this.width}; height: ${this.height};
                  border: 5px solid black;
                  z-index: 10">
               </div>`;
   }
}

const maze = [
   new Maze(mazeSize, blockSize, blockTile.E, 0, 0, "E"),
   new Maze(mazeSize, blockSize, blockTile.ESW, 0, 1, "E S W"),
   new Maze(mazeSize, blockSize, blockTile.W, 0, 2, "W"),
   new Maze(mazeSize, blockSize, blockTile.E, 0, 3, "E"),
   new Maze(mazeSize, blockSize, blockTile.SW, 0, 4, "S W"),
   new Maze(mazeSize, blockSize, blockTile.E, 1, 0, "E"),
   new Maze(mazeSize, blockSize, blockTile.ESWN, 1, 1, "E S W N"),
   new Maze(mazeSize, blockSize, blockTile.W, 1, 2, "W"),
   new Maze(mazeSize, blockSize, blockTile.E, 1, 3, "E"),
   new Maze(mazeSize, blockSize, blockTile.SWN, 1, 4, "S W N"),
   new Maze(mazeSize, blockSize, blockTile.E, 2, 0, "E"),
   new Maze(mazeSize, blockSize, blockTile.ESWN, 2, 1, "E S W N"),
   new Maze(mazeSize, blockSize, blockTile.W, 2, 2, "W"),
   new Maze(mazeSize, blockSize, blockTile.E, 2, 3, "E"),
   new Maze(mazeSize, blockSize, blockTile.SWN, 2, 4, "S W N"),
   new Maze(mazeSize, blockSize, blockTile.E, 3, 0, "E"),
   new Maze(mazeSize, blockSize, blockTile.ESWN, 3, 1, "E S W N"),
   new Maze(mazeSize, blockSize, blockTile.W, 3, 2, "W"),
   new Maze(mazeSize, blockSize, blockTile.E, 3, 3, "E"),
   new Maze(mazeSize, blockSize, blockTile.SWN, 3, 4, "S W N"),
   new Maze(mazeSize, blockSize, blockTile.E, 4, 0, "E"),
   new Maze(mazeSize, blockSize, blockTile.EWN, 4, 1, "E W N"),
   new Maze(mazeSize, blockSize, blockTile.EW, 4, 2, "E W"),
   new Maze(mazeSize, blockSize, blockTile.EW, 4, 3, "E W"),
   new Maze(mazeSize, blockSize, blockTile.WN, 4, 4, "W N"),
]

const player = new Player();

const keys = {
   up: {
		pressed: false
   },
   down: {
		pressed: false
   },
	right: {
		pressed: false
	},
	left: {
		pressed: false
	},
}

function animate() {
   requestAnimationFrame(animate)
   $("#game-container").empty();
   let generateBlock = "";
   let index = 0;

   for (let i = 0 ; i < mazeSize ; i++) {
      generateBlock += `<div class="row">`;
      for (let j = 0 ; j < mazeSize ; j++) {
         generateBlock += maze[index].generateBlock();
         index++
      }
      generateBlock += `</div>`
   }

   $("#game-container").append(generateBlock);
   $("#game-container").append(player.draw());

   // Movement with no collisions
   // if(keys.up.pressed) { player.velocityY = -playerSpeed; }
   // else if(keys.down.pressed) { player.velocityY = playerSpeed; }
   // if(keys.left.pressed) { player.velocityX = -playerSpeed; }
   // else if(keys.right.pressed) { player.velocityX = playerSpeed; }
   // else { player.velocityX = 0; player.velocityY = 0; }

   player.velocityX = 0; player.velocityY = 0; 
   const square = document.querySelectorAll(".maze-block");
   square.forEach((square1, index) => {

      // Checking which maze block is user currently located
      if(whereIsPlayer(square1)) {
         console.log("player in " + square1.id)

         if(keys.up.pressed) { 

            if (square1.classList.contains("N")) {
               player.velocityY = -playerSpeed; 
            } else if (checkCollision(square1, "N")) {
               player.velocityY = -playerSpeed; 
            }
   
         } else if(keys.down.pressed) { 

            if (square1.classList.contains("S")) {
               player.velocityY = playerSpeed; 
            } else if (checkCollision(square1, "S") ) {
               player.velocityY = playerSpeed; 
            }

         } else if(keys.left.pressed) { 
            
            if (square1.classList.contains("W")) {
               player.velocityX = -playerSpeed; 
            } else if (checkCollision(square1, "W") ) {
               player.velocityX = -playerSpeed; 
            }
         
         } else if(keys.right.pressed) { 
            
            if (square1.classList.contains("E")) {
               player.velocityX = playerSpeed; 
            } else if (checkCollision(square1, "E") ) {
               player.velocityX = playerSpeed; 
            }
         
         } else { player.velocityX = 0; player.velocityY = 0; }

      // Checking if user is located between two maze blocks
      } else if (isInBetween(square1)) {
         console.log("player in between " + square1.id)

         if(keys.up.pressed) { 

            if (checkCollision(square1, "N")) {
               player.velocityY = -playerSpeed; 
            }
   
         } else if(keys.down.pressed) { 

            if (checkCollision(square1, "S") ) {
               player.velocityY = playerSpeed; 
            }

         } else if(keys.left.pressed) { 
            
            if (checkCollision(square1, "W") ) {
               player.velocityX = -playerSpeed; 
            }
         
         } else if(keys.right.pressed) { 
            
            if (checkCollision(square1, "E") ) {
               player.velocityX = playerSpeed; 
            }
         
         }

      }
   })

}

animate(); 

$(document).keydown(function(e) {
	
	if(gameMode == "keyboard" && gameState == 1) {
		// Log the key code in the console
		console.log("Key pressed: " + e.keyCode);
		switch (e.keyCode) {
			case 87:
				keys.up.pressed = true;
				// player.velocityY -= 10
				break;
			case 65:
				keys.left.pressed = true;
				// player.velocityX -= 10
				break;
			case 83:
				keys.down.pressed = true;
				break;
			case 68:
				keys.right.pressed = true;
				break;
		}
	}
});

$(document).keyup(function(e) {
	
	switch (e.keyCode) {
		case 87:
			keys.up.pressed = false;
			break;
		case 65:
			keys.left.pressed = false;
			break;
		case 83:
			keys.down.pressed = false;
			break;
		case 68:
			keys.right.pressed = false;
			break;
	}
	
});

function whereIsPlayer(square) {
   const squareRect = square.getBoundingClientRect();
   return (
      player.x >= squareRect.left &&
      player.x + player.width <= squareRect.right &&
      player.y >= squareRect.top &&
      player.y + player.height <= squareRect.bottom
    );
}

function isInBetween(square) {
   const squareRect = square.getBoundingClientRect();
   return ( 
      (player.x <= squareRect.right && player.x + player.width >= squareRect.right && square.classList.contains("E")) ||
      (player.x + player.width >= squareRect.left && player.x <= squareRect.left && square.classList.contains("W")) ||
      (player.y <= squareRect.bottom && player.y + player.height >= squareRect.bottom && square.classList.contains("S")) ||
      (player.y + player.height >= squareRect.top && player.y <= squareRect.top && square.classList.contains("N"))

    );
}

function checkCollision (square, direction) {

   const squareRect = square.getBoundingClientRect();
   const gameRect = gameContainer.getBoundingClientRect();
   if(direction == "N") {
      return (player.y - playerSpeed > squareRect.top && player.y - playerSpeed > gameRect.top )
   } else if(direction == "S") {
      return (player.y + player.height + playerSpeed < squareRect.bottom && player.y + player.height + playerSpeed < gameRect.bottom)
   } else if(direction == "W") {
      return (player.x - playerSpeed > squareRect.left && player.x - playerSpeed > gameRect.left)
   } else if(direction == "E") {
      return (player.x + player.width + playerSpeed < squareRect.right && player.x + player.width + playerSpeed < gameRect.right)
   } else return false

}