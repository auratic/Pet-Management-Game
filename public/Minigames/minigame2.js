// import kittyStand from "./Assets/kitty-stand-sprite.png";
const kittyStand = "./Assets/kitty-stand-sprite.png"
const tile = "./Assets/tile.png";
const house1 = "./Assets/house1.png";

const canvas = document.querySelector('canvas');
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


if(	window.screen.height >= 2560 || window.screen.width >= 2560 ) {
	jumpSpeed = canvas.height * .015;
} else if(	window.screen.height >= 1920 || window.screen.width >= 1920 ) {
	jumpSpeed = canvas.height * .022;
} else if(	window.screen.height >= 1280 || window.screen.width >= 1280 ) {
	jumpSpeed = canvas.height * .023;
} else if(	window.screen.height >= 1024 || window.screen.width >= 1024 ) {
	jumpSpeed = canvas.height * .025;
} else {
	jumpSpeed = canvas.height * .035;
}

let fpsCount = 0; // Make the Player spritesheet animation runs slower
let delay = 200;

class Player {
	constructor () {
		this.speed = 10;
		this.position = {
			x: 10,
			y: canvas.height * .65
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
		// turn off image aliasing
		c.msImageSmoothingEnabled = false;
		c.mozImageSmoothingEnabled = false;
		c.webkitImageSmoothingEnabled = false;
		c.imageSmoothingEnabled = false;

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
		if(this.position.y + this.height + this.velocity.y >= canvas.height) {
			isJump = false;
			this.velocity.y = 0;
		} else {
			this.velocity.y += this.gravity;
		}
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
		
		// turn off image aliasing
		c.msImageSmoothingEnabled = false;
		c.mozImageSmoothingEnabled = false;
		c.webkitImageSmoothingEnabled = false;
		c.imageSmoothingEnabled = false;

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

const player = new Player();
const platforms = [	
	new Platform({x: 0, y: tileY, width: tileSize, height: tileSize, image: createImage(tile)}),
	new Platform({x: 0, y: tileY * .5, width: tileSize * 2, height: tileSize * 2, image: createImage(house1)})
 ];

for( let i = 0 ; i < 50 ; i++) { 
	platforms.push(new Platform({x: tileSize * i, y: tileY, width: tileSize, height: tileSize, image: createImage(tile)}));
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

	requestAnimationFrame(animate);
	c.clearRect(0,0,canvas.width,canvas.height);
	platforms.forEach(platform => {
		platform.draw();
	});
	player.update();

	if(keys.right.pressed && player.position.x < 400) {
		player.velocity.x = playerSpeed;
	} else if(keys.left.pressed && player.position.x > 10) {
		player.velocity.x = -playerSpeed;
	} else {
		player.velocity.x = 0;
		if (keys.right.pressed && scrollOffset < 1000) {

			scrollOffset++
			console.log(scrollOffset)
			platforms.forEach(platform => {
				platform.position.x -= playerSpeed
			});

		} else if (keys.left.pressed && scrollOffset > 0) {

			scrollOffset--;
			console.log(scrollOffset)
			platforms.forEach(platform => {
				platform.position.x += playerSpeed
			});

		}
	}

	// Platform collision detection
	platforms.forEach(platform => {
		if(player.position.y + player.height <= platform.position.y &&
			player.position.y + player.height + player.velocity.y >= platform.position.y &&
			player.position.x + player.width >= platform.position.x &&
			player.position.x <= platform.position.x + platform.width) {
			isJump = false;
			player.velocity.y = 0;
		}
	});
}

animate();


$(document).keydown(function(e) {
	
    // Log the key code in the console
    console.log("Key pressed: " + e.keyCode);

	switch (e.keyCode) {
		case 87:
			if (!isJump) { player.velocity.y = -jumpSpeed; isJump = true; }
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
		case 83:
			// player.velocity.y = 20;
			break;
		case 68:
			keys.right.pressed = false;
			// player.velocity.x = 0;
			break;
	}
	
});

// HANDTRACK.JS

const video = document.getElementById("video");

// Load the handtrack.js model
const modelParams = {
    flipHorizontal: true,   // Flip the video horizontally for a better user experience
    maxNumBoxes: 1,        // Maximum number of boxes to track
    iouThreshold: 0.5,     // Intersection over Union (IoU) threshold for bounding boxes
    scoreThreshold: 0.6,   // Confidence score threshold
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
        if (predictions.length > 0) {
            // Get the hand's bounding box
            const hand = predictions[0].bbox;
            handBox = predictions[0].label;
            // Draw a red dot at the center of the hand
            soapX = (hand[0] + hand[2] / 2) * scale;
            soapY = (hand[1] + hand[3] / 2) * scale;
            console.log(predictions[0].label);
            //console.log("without" + (hand[0] + hand[2] / 2))
            //console.log("scaled" + soapX)
        }

        // Continue running detection
        requestAnimationFrame(() => runDetection(model));
    });
}