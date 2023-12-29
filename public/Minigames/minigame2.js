
var playBGM = false;
var BGM = new Audio('Assets/Audio/Poupis-Theme.mp3');
BGM.volume= 0.8;
BGM.loop= true;

var click = new Audio('Assets/Audio/click-sound.mp3');
click.volume= 0.8;

var countdownSFX = new Audio('Assets/Audio/countdown.mp3');
countdownSFX.volume= 0.8;

window.onclick = () => {
    click.play();

    if(!playBGM) {
        BGM.play();
        playBGM = true;
    }
}
window.onresize = () => {
	setFontSize()
}
function setFontSize () {
    if(	window.screen.height >= 4096 || window.screen.width >= 4096 ) {
        // (window.innerHeight > window.innerWidth) ? $("a").css({"font-size": "2em"}) : $("a").css({"font-size": "1em"});
		jumpSpeed = canvas.height * .015;
        $("label").css({"font-size": ".8em"});
        $("button").css({"font-size": ".8em"});
        $("table").css({"font-size": ".5em"});
        $("h1").css({"font-size": "1em"});
        $("h4").css({"font-size": ".8em"});
    }
    if(	window.screen.height >= 2560 || window.screen.width >= 2560 ) {
        // (window.innerHeight > window.innerWidth) ? $("a").css({"font-size": "2em"}) : $("a").css({"font-size": "1em"});
        $("label").css({"font-size": ".8em"});
        $("button").css({"font-size": ".8em"});
        $("table").css({"font-size": ".5em"});
        $("h1").css({"font-size": "1em"});
        $("h4").css({"font-size": ".6em"});
    } else if(	window.screen.height >= 1920 || window.screen.width >= 1920 ) {
        $("h1").css({"font-size": "1em"})
    } else if(	window.screen.height >= 1280 || window.screen.width >= 1280 ) {
        $("h1").css({"font-size": "1em"})
    } else if(	window.screen.height >= 1024 || window.screen.width >= 1024 ) {
        $("h1").css({"font-size": "1em"})
    } else {
        $("h1").css({"font-size": "1em"});
    }

}

let gameState = 0; // 0 = stop, 1 = start
let gameMode = '';

$(document).ready(function(){
    setFontSize();
	$('#retry').on('click', () => {
	  window.location.reload(true);
	});
  
	$('#menu').on('click', () => {
	  window.location.replace("/");
	});
  
	$('#start').on('click', () => {
  
		gameMode = $('#gamemode input:radio:checked').val();
		console.log(gameMode)
		$('#start-overlay').css({'display':'none'});
		$('#countdown-overlay').css({'display':'flex'});
		let count = 2
	
		if(gameMode == "cam") {
			$('#cam-instruction').css({'display': 'flex'})
			initHandtrack();
		} else {
			$('#keyboard-instruction').css({'display': 'flex'})
		}
		
		let countdown = setInterval(() => {
			
			if(count <= 0) {
				clearInterval(countdown);
				$('#countdown-overlay').css({'display':'none'});
				gameState = 1;
		
				//   let gameTime = setInterval(() => {
				// 	if (time <= 0) {
				// 	  gameOver();
				// 	  clearInterval(gameTime);
				// 	} else {
				// 	  $('#time').html(`${time} seconds`); 
				// 	  time--;
				// 	}
		
				//   }, 1000);
	
			} else {
				$('#countdown-overlay > h1').html(count);
				count--
			}
		}, 1000);
  
	});
  
});

// import kittyStand from "./Assets/kitty-stand-sprite.png";
const kittyStand = "./Assets/kitty-stand-sprite.png"
const tile = "./Assets/tile.png";
const house1 = "./Assets/house1.png";
const background = "./Assets/blue.png";
const coin = "./Assets/sardine.png";
const pole = "./Assets/pole.png";

const canvas = document.querySelector('#canvas-container');
const c = canvas.getContext('2d');

// $("canvas").css({"width": "1024", "height": "620"});
const canvasHeight = document.getElementById("game-container").clientHeight;
const canvasWidth = document.getElementById("game-container").clientWidth;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const tileSize = canvas.height * .2;
const tileY = canvas.height * .8
const playerSize = canvas.height * .15;
const playerSpeed = canvas.height * .01;
var jumpSpeed = canvas.height * .015;

// var detectHand = false;
// var keyboard = true;
// var handSign;

var score = 0;

if(	window.screen.height >= 2560 || window.screen.width >= 2560 ) {
	jumpSpeed = canvas.height * .018;
	$("body").css({"font-size": "7em"})
} else if(	window.screen.height >= 1920 || window.screen.width >= 1920 ) {
	jumpSpeed = canvas.height * .022;
	$("body").css({"font-size": "3em"})
	$("h1").css({"font-size": "3em"})
} else if(	window.screen.height >= 1280 || window.screen.width >= 1280 ) {
	jumpSpeed = canvas.height * .026;
	$("body").css({"font-size": "3em"})
	$("h1").css({"font-size": "3em"})
} else if(	window.screen.height >= 1024 || window.screen.width >= 1024 ) {
	jumpSpeed = canvas.height * .025;
	$("body").css({"font-size": "3em"})
	$("h1").css({"font-size": "3em"})
} else {
	jumpSpeed = canvas.height * .035;
	$("body").css({"font-size": "2em"})
	$("h1").css({"font-size": "2em"})
}

let fpsCount = 0; // Make the Player spritesheet animation runs slower
let delay = 200;

class Player {
	constructor () {
		this.speed = 10;
		this.position = {
			x: canvas.width * .08,
			y: canvas.height * .62
		}
		this.velocity = {
			x: 0,
			y: 0
		}
		this.width = playerSize;
		this.height = playerSize;
		this.gravity = 0.5;

		this.image = createImage(kittyStand);
		this.frame = 0;
	}

	draw() {
		c.drawImage(
			this.image, 
			32 * this.frame, 0, 32, 32,
			this.position.x, this.position.y, 
			this.width, this.height)
	}
	
	update () {
		// Control Animation FPS
		if(fpsCount >= delay) {
			fpsCount = 0
			this.frame++;
			if(this.frame >= 5) this.frame = 0;
		} else fpsCount += 10;
		

		this.position.y += this.velocity.y;
		this.position.x += this.velocity.x;

		this.velocity.y += this.gravity;

		// Collision detection with the canvas
		// if(this.position.y + this.height + this.velocity.y >= canvas.height) {
		// 	isJump = false;
		// 	this.velocity.y = 0;
		// } else {
		// 	this.velocity.y += this.gravity;
		// }
		this.draw();
	}
}

class Platform {
	constructor ({ x, y, width, height, image }) {
		this.position = {
			x,
			y,
		}
		this.image = image;
		this.width = width;
		this.height = height;
	}

	draw() {
		c.drawImage(
			this.image, 
			this.position.x, this.position.y, 
			this.width, this.height)
	}

}


class Decor {
	constructor ({ x, y }) {
		this.position = {
			x,
			y
		}

		this.width = 200;
		this.height = 20;
	}

	draw() {
		c.fillStyle = "blue";
		c.fillRect(this.position.x, this.position.y, this.width, this.height);
	}

}

class Coin {
	constructor ({ x, y, width, height, image}) {
		this.position = {
			x,
			y
		}
		this.image = image;
		this.width = width;
		this.height = height;
	}

	draw() {
		c.drawImage(
			this.image, 
			this.position.x, this.position.y, 
			this.width, this.height)
	}

}

const player = new Player();
const platforms = [	
	new Platform({x: 0, y: tileY, width: tileSize, height: tileSize, image: createImage(tile)}),
	new Platform({x: tileSize * 4, y: tileY * .5, width: tileSize * 2, height: tileSize * 2, image: createImage(house1)}),
	new Platform({x: tileSize * 6, y: tileY * .5, width: tileSize * 2, height: tileSize * 2, image: createImage(house1)}),
	new Platform({x: tileSize * 12, y: tileY * .5, width: tileSize * 2, height: tileSize * 2, image: createImage(house1)})
 ];

for( let i = 0 ; i < 55 ; i++) { 
	let randPit = (Math.floor(Math.random() * 10) > 8) ? true : false;
	if(i < 10 || i > 50)
		platforms.push(new Platform({x: tileSize * i, y: tileY, width: tileSize, height: tileSize, image: createImage(tile)}));
	if(!randPit)
		platforms.push(new Platform({x: tileSize * i, y: tileY, width: tileSize, height: tileSize, image: createImage(tile)}));
}

const coins = [
	// new Coin ({x: tileSize * 1, y: tileY * .85, width: tileSize / 2, height: tileSize / 2, image: createImage(coin)}),
	// new Coin ({x: tileSize * 2, y: tileY * .35, width: tileSize / 2, height: tileSize / 2, image: createImage(coin)}),
	// new Coin ({x: tileSize * 3, y: tileY * .35, width: tileSize / 2, height: tileSize / 2, image: createImage(coin)}),
	// new Coin ({x: tileSize * 4, y: tileY * .35, width: tileSize / 2, height: tileSize / 2, image: createImage(coin)}),
	// new Coin ({x: tileSize * 5, y: tileY * .35, width: tileSize / 2, height: tileSize / 2, image: createImage(coin)}),
	// new Coin ({x: tileSize * 6, y: tileY * .85, width: tileSize / 2, height: tileSize / 2, image: createImage(coin)}),
	// new Coin ({x: tileSize * 7, y: tileY * .85, width: tileSize / 2, height: tileSize / 2, image: createImage(coin)}),
	// new Coin ({x: tileSize * 8, y: tileY * .85, width: tileSize / 2, height: tileSize / 2, image: createImage(coin)}),
	// new Coin ({x: tileSize * 9, y: tileY * .85, width: tileSize / 2, height: tileSize / 2, image: createImage(coin)}),
	new Coin ({x: tileSize * 52, y: tileY * .5, width: tileSize * 2, height: tileSize * 2, image: createImage(pole)}),
]

for( let i = 2 ; i < 50 ; i++) { 
	let randY = (Math.floor(Math.random() * 10) > 5) ? tileY * .35 : tileY * .85;
	coins.push(new Coin({x: tileSize * i, y: randY, width: tileSize / 2, height: tileSize / 2, image: createImage(coin)}));
}

const keys = {
	right: {
		pressed: false
	},
	left: {
		pressed: false
	},
}

function createImage(imgSrc) {
	// let image = new Image()
	// image.src = imgSrc;
	// return image;
	let image = document.createElement('img');
	image.src = imgSrc;
	return image
}

let scrollOffset = 0; // Prevent player running out of map
let isJump = false; // Prevent multiple jump

function animate () {
	let animateToggle = requestAnimationFrame(animate);
	c.clearRect(0,0,canvas.width,canvas.height);
	
	// turn off image aliasing
	c.msImageSmoothingEnabled = false;
	c.mozImageSmoothingEnabled = false;
	c.webkitImageSmoothingEnabled = false;
	c.imageSmoothingEnabled = false;

	/*
	 *
	 * Background
	 *
	 */

	c.drawImage(
		createImage(background), 
		0, 0, 
		canvas.width,canvas.height)

	platforms.forEach(platform => {
		platform.draw();
	});
	coins.forEach(coin => {
		coin.draw();
	});
	player.update();

	/*
	 *
	 * Control;
	 *
	 */

	if(keys.right.pressed && player.position.x < canvas.width * .4) {
		player.velocity.x = playerSpeed;

	} else if(keys.left.pressed && player.position.x > canvas.width * .05) {
		player.velocity.x = -playerSpeed;

	} else {
		player.velocity.x = 0;
		if (keys.right.pressed && scrollOffset < 1000) {

			scrollOffset++
			console.log(scrollOffset)
			platforms.forEach(platform => {
				platform.position.x -= playerSpeed
			});
			coins.forEach(coin => {
				coin.position.x -= playerSpeed
			});

		} else if (keys.left.pressed && scrollOffset > 0) {

			scrollOffset--;
			console.log(scrollOffset)
			platforms.forEach(platform => {
				platform.position.x += playerSpeed
			});
			coins.forEach(coin => {
				coin.position.x += playerSpeed
			});

		}
	}

	/*
	*
	* Platform collision detection
	*
	*/
	platforms.forEach(platform => {
		//Floor collision
		if(player.position.y + player.height <= platform.position.y &&
			player.position.y + player.height + player.velocity.y >= platform.position.y &&
			player.position.x + player.width >= platform.position.x &&
			player.position.x <= platform.position.x + platform.width
			) {
			isJump = false;
			player.velocity.y = 0;
		}

		//Building collision
		// if(player.position.y + player.height >= platform.position.y &&
		// 	player.position.x + player.width + player.velocity.x > platform.position.x &&
		// 	player.position.x  + player.velocity.x < platform.position.x + platform.width) {
		// 		player.velocity.x = 0;
		// 		console.log("Inside")
		// 	}
	});

	/*
	*
	* Coin collision detection
	*
	*/

	if(coins.length > 0) {
		coins.forEach((coin, index) => {
			if(player.position.y < coin.position.y + coin.height &&
				player.position.y + player.height > coin.position.y &&
				player.position.x + player.width > coin.position.x &&
				player.position.x < coin.position.x + coin.width
				) {
					if (index != 0) {
						coins.splice(index, 1);
						score++;
						$("#score").html(`Score: ${score}`)
					}
			}
	
		});
	} else {
		// alert ("You Win");
		// gameOver();
		// cancelAnimationFrame(animate);
	}

	if(scrollOffset >= 1000) {
		cancelAnimationFrame(animateToggle);
		alert ("You Win");
		gameOver();
	}
	if(player.position.y + player.height + player.velocity.y >= canvas.height) {
		cancelAnimationFrame(animateToggle);
		alert ("You fall into the pit !");
		gameOver();
	}
}

animate();


$(document).keydown(function(e) {
	
	if(gameMode == "keyboard" && gameState == 1) {
		// Log the key code in the console
		console.log("Key pressed: " + e.keyCode);
		switch (e.keyCode) {
			case 87:
				if (!isJump) { player.velocity.y = -jumpSpeed; isJump = true;  click.play(); }
				break;
			case 65:
				keys.left.pressed = true;
				// player.velocity.x = -10;
				break;
			// case 83:
			// 	player.velocity.y = 20;
			// 	break;
			case 68:
				keys.right.pressed = true;
				// player.velocity.x = 10;
				break;
		}
	}
});

$(document).keyup(function(e) {
	
	switch (e.keyCode) {
		case 87:
			// player.velocity.y = -20;
			break;
		case 65:
			keys.left.pressed = false;
			// player.velocity.x = 0;
			break;
		// case 83:
		// 	// player.velocity.y = 20;
		// 	break;
		case 68:
			keys.right.pressed = false;
			// player.velocity.x = 0;
			break;
	}
	
});

/*
 *
 * HANDTRACK.JS
 * 
 */

function initHandtrack() {
	const video = document.getElementById("video");
	const vcanvas =  document.getElementById("vcanvas");
	const vctx =  vcanvas.getContext("2d");
	$("#vcanvas").css({"height": `${canvas.height * .2}`, "width": `${canvas.height * .22}`, "top": `0`});
	$("#score").css({"top": `0`, "right": '5'});
	
	// Load the handtrack.js model
	const modelParams = {
		flipHorizontal: true,   // Flip the video horizontally for a better user experience
		maxNumBoxes: 1,        // Maximum number of boxes to track
		iouThreshold: 0.5,     // Intersection over Union (IoU) threshold for bounding boxes
		scoreThreshold: 0.4,   // Confidence score threshold
	};
	
	handTrack.load(modelParams).then(model => {
	// Start the webcam feed
		handTrack.startVideo(video).then(status => {
			if (status) {
			// Run the detection loop
			runDetection(model);
			}
		});
	});
	
	function runDetection(model) {
		model.detect(video).then(predictions => {
			// detectHand = false
			keys.left.pressed = false;
			keys.right.pressed = false;
			model.renderPredictions(predictions, vcanvas, vctx, video);
			if (predictions.length > 0) {
				let label = predictions[0].label
				
				if(label !== "face") {
					// detectHand = true
					
					if(label == "point") {
						// handSign = "point";
					   keys.right.pressed = true;

					} else if(label == "closed") {
						// handSign = "closed";
					   keys.left.pressed = true;
			  
					} else if (label == "open") {
						// handSign = "open";
					   if (!isJump) { player.velocity.y = -jumpSpeed; isJump = true; click.play(); }
					}
				}
			} 
	
			// Continue running detection
			requestAnimationFrame(() => runDetection(model));
		});
	}
	
	function getCameraAccess() {
	
		navigator.getUserMedia (
			// constraints
			{ video: true },
	
			// successCallback
			stream => {
				
				// video.src = window.URL.createObjectURL(stream);
				// video.onloadedmetadata = function(e) {
				// 	// Do something with the video here.
				// };
			},
		 
			// errorCallback
			err => {
				alert("Please enable your camera !");
			}
		);
		 
	}
	getCameraAccess();
}

/*
 *
 * Game Over
 * 
 */


function gameOver () {
	if(gameState == 1) {
		BGM.volume = 0.4;
		if(gameMode == 'cam') score = score * 2;
		$('#point').html(score);
		$('#end-overlay').css({'display': 'flex'}); 
		gameState = 0; 
	  
		let getLeaderboard = new Promise ((res, rej) => {
		  $.ajax({
			url: "/setLeaderboard",
			method: "POST",  
			data: {
				game: "platformer",
				point: score,
			},
			cache: false,
			dataType: 'json',
			success: function(data){
		
			  res()
		
			},
			error: function(errMsg) {
				alert(JSON.stringify(errMsg));
				res()
			}
		  });
		})
		.then(() => {
	  
		  $.ajax({
			url: "/getLeaderboard",
			method: "POST",  
			data: {
				game: "platformer",
			},
			cache: false,
			dataType: 'json',
			success: function(data){
	  
				let counter = 1;
				console.log(data);
		
				data.forEach((user) => {
		
					let html = `
					<tr>
					<th scope="row">${counter}</th>
					<td>${user.username}</td>
					<td>${user.platformer}</td>
					</tr>`;
					$('#scoreboard > tbody').append(html);
		
					counter++;
				})
	  
			},
			error: function(errMsg) {
				alert(JSON.stringify(errMsg));
				rej(errMsg)
			}
		  });
	  
		})
		.catch((result) => {
		  alert(JSON.stringify(result));
		});
	  
		
		$.ajax({
		  url: "/updateCoin",
		  method: "POST",  
		  data: {
			  coin: score,
		  },
		  cache: false,
		  success: function(data){
	  
			alert(`${score} coins added`);
	  
		  },
		  error: function(errMsg) {
			  alert(JSON.stringify(errMsg));
		  }
		});
	}
}