const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
	constructor () {
		this.position = {
			x: 10,
			y: 10
		}
		this.velocity = {
			x: 0,
			y: 0
		}
		this.width = 100;
		this.height = 100;
		this.gravity = 0.5;
	}

	draw() {
		c.fillStyle = 'red';
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
	
	update () {
		this.position.y += this.velocity.y;
		this.position.x += this.velocity.x;
		if(this.position.y + this.height + this.velocity.y >= canvas.height) {
			this.velocity.y = 0;
		} else {
			this.velocity.y += this.gravity;
		}


		
		this.draw();
	}
}

class Platform {
	constructor () {

	}

	collision () {

	}

}


const player = new Player();
function animate () {

	requestAnimationFrame(animate);
	c.clearRect(0,0,canvas.width,canvas.height);
	player.update();
}

animate();

$(document).keydown(function(e) {
	
    // Log the key code in the console
    console.log("Key pressed: " + e.keyCode);

	switch (e.keyCode) {
		case 87:
			player.velocity.y -= 20;
			break;
		case 65:
			player.velocity.x -= 20;
			break;
		case 83:
			player.velocity.y += 20;
			break;
		case 68:
			player.velocity.x += 20;
			break;
	}
		
});

$(document).keyup(function(e) {
	
	player.velocity.y = 0;
	player.velocity.x = 0;
	
});
