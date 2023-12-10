(window.innerHeight > window.innerWidth) ? $('#phaser-container').css({'width':'100%'}) : $('#phaser-container').css({'width':'80vh'});

const gamecontainer = document.getElementById('phaser-container');
var soapX = null;
var soapY = null;

var handBox = null;
var scale = gamecontainer.clientWidth / gamecontainer.clientHeight;
var washCount = 0;

var foodContainerSizeX = gamecontainer.clientWidth * 0.2
var foodContainerSizeY = gamecontainer.clientHeight * 0.1
var foodContainerX1 = (gamecontainer.clientWidth / 2) - (foodContainerSizeX / 2)
var foodContainerX2 = (gamecontainer.clientWidth / 2) - (foodContainerSizeX / 2) + foodContainerSizeX 
var foodContainerY1 = gamecontainer.clientHeight - (gamecontainer.clientHeight * 0.1)
var foodContainerY2 = gamecontainer.clientHeight

// $('#video').css({
//     'opacity':'25%',
//     'height': gamecontainer.clientHeight,
//     'width': gamecontainer.clientWidth,
//     'position': 'absolute',
//     '-webkit-transform': 'scaleX(-1)',
//     'transform': 'scaleX(-1)'
// });
var catIdle;
var catFeed;
var isMouseButtonDown = false;
var itemsGroup;
var area;
var hunger = 0;
var isFeed;

var gameState = 1;

class Example extends Phaser.Scene
{
    preload ()
    {
        //this.load.setBaseURL('https://labs.phaser.io');
        this.load.image('love','Assets/bubble(heart).png')
        this.load.image('cat', 'Assets/cat-idle-floor.gif')
        this.load.image('bathroom', 'Assets/bathroom.png')
        this.load.image('soap', 'Assets/soap.png')
        this.load.image('bubble', 'Assets/bubble.png')
        this.load.image('background', 'Assets/background.jpg')
        this.load.image('bathtub', 'Assets/bathtub_sprite.png')
        this.load.image('sink', 'Assets/sink_sprite.png')
        this.load.image('stool', 'Assets/stool.png')
        this.load.image('sardine', 'Assets/sardine.png')
        this.load.image('kibble', 'Assets/kibble.png')
        this.load.image('kibble-box', 'Assets/kibble-package.png')

        this.load.spritesheet('feed', 'Assets/kitty-feed-spritesheet.png', { frameWidth: 32, frameHeight: 32, endFrame: 11});
        this.load.spritesheet('idle', 'Assets/kitty-idle-spritesheet.png', { frameWidth: 32, frameHeight: 32, endFrame: 4});
    }

    create ()
    {
        const background = this.add.tileSprite(0, 0, gamecontainer.clientWidth, gamecontainer.clientHeight, 'background');
        background.setOrigin(0, 0); // Set the tile sprite's origin to the top-left corner
        background.setTileScale(1, 1); // Make the background repeat horizontally and vertically and adjust the scaling as needed

        itemsGroup = this.physics.add.group();
        this.physics.world.enable(itemsGroup); // Enable physics for all items in the group
        
        var box = this.add.sprite(50, 300, 'kibble-box');
        box.scaleX = 3;
        box.scaleY = 3;
        box.setInteractive({ draggable: true });
        box.on('dragstart', function (pointer, dragX, dragY) {
            console.log('Drag start at: ' + dragX + ', ' + dragY);
            box.rotation += Phaser.Math.DegToRad(45);
            isMouseButtonDown = true;
        });
        box.on('drag', function (pointer, dragX, dragY) { // Update the item position during drag
            box.x = dragX;
            box.y = dragY;
        });
        box.on('dragend', function (pointer) {
            console.log('Drag end');
            box.rotation -= Phaser.Math.DegToRad(45);
            isMouseButtonDown = false;
        });

        // Enable input for the scene
        this.input.on('pointerdown', function (pointer) {
        });

        this.input.on('pointerup', function (pointer) {
        });

        // const collider = this.physics.add.collider(cat, stool, null, () =>
        // {
        //     //this.physics.world.removeCollider(collider);
        // });
        
        // Create a Graphics object
        var graphics = this.add.graphics();
        // Set the line style
        graphics.lineStyle(10, 0x000000, 1); // 4 pixels wide, red color, full alpha
        graphics.strokeLineShape(new Phaser.Geom.Line(foodContainerX1, foodContainerY1, foodContainerX1, foodContainerY2)); // Draw a line
        graphics.lineStyle(10, 0x000000, 1); // 4 pixels wide, red color, full alpha
        graphics.strokeLineShape(new Phaser.Geom.Line(foodContainerX2, foodContainerY1, foodContainerX2, foodContainerY2)); // Draw a line
        graphics.fillStyle(0x808080); // 0x808080 represents the gray color
        graphics.fillRect(foodContainerX1, foodContainerY1, foodContainerSizeX, foodContainerSizeY);

        // Create a sprite with a physics body from the drawn line
        var lineSprite = this.physics.add.staticSprite(foodContainerX1, foodContainerY1 + (foodContainerSizeY / 2), ''); // The empty string as the key means no texture
        var lineSprite2 = this.physics.add.staticSprite(foodContainerX2, foodContainerY1 + (foodContainerSizeY / 2), ''); // The empty string as the key means no texture
        this.physics.world.enable(lineSprite); // Enable the physics body for the sprite
        // lineSprite.setCollideWorldBounds(true);
        this.physics.world.enable(lineSprite2); // Enable the physics body for the sprite
        // lineSprite2.setCollideWorldBounds(true);
        var rectangle = new Phaser.Geom.Rectangle(foodContainerX1, foodContainerY1, 10, foodContainerSizeY);
        var rectangle2 = new Phaser.Geom.Rectangle(foodContainerX2, foodContainerY2, 10, foodContainerSizeY);
        lineSprite.body.setSize(rectangle.width, rectangle.height); // Set the size of the physics body to match the line
        //lineSprite.body.moves = false; // Make the line sprite immovable (since it's not meant to be pushed around)
        lineSprite2.body.setSize(rectangle2.width, rectangle2.height); // Set the size of the physics body to match the line
        //lineSprite2.body.moves = false; // Make the line sprite immovable (since it's not meant to be pushed around)

        this.physics.add.collider(lineSprite, itemsGroup, null, () =>
        {
            //this.physics.world.removeCollider(collider);
        });
        
        this.physics.add.collider(lineSprite2, itemsGroup, null, () =>
        {
            //this.physics.world.removeCollider(collider);
        });

        this.physics.add.collider(itemsGroup, itemsGroup, null, () =>
        {
            //this.physics.world.removeCollider(collider);
        });

        var catPosX = gamecontainer.clientWidth / 2;
        var catPosY = gamecontainer.clientHeight - 32*5; // 32 bits size multiply by 4 (8/2)
        const feed = {
            key: 'feedAnimation',
            frames: this.anims.generateFrameNumbers('feed', { start: 0, end: 10}),
            frameRate: 12,
            repeat: -1
        };

        this.anims.create(feed);
        catFeed = this.add.sprite(catPosX, catPosY, 'feed').play('feedAnimation');
        catFeed.scaleX = 10;
        catFeed.scaleY = 10;
        catFeed.setVisible(false);

        const idle = {
            key: 'idleAnimation',
            frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 4}),
            frameRate: 12,
            repeat: -1
        };

        this.anims.create(idle);
        catIdle = this.add.sprite(catPosX, catPosY, 'idle').play('idleAnimation');
        catIdle.scaleX = 10;
        catIdle.scaleY = 10;
    }

    update() {
        var item
        if (isMouseButtonDown) {
            item = itemsGroup.create(this.input.x, this.input.y, 'kibble');
            item.scaleX = 0.5;
            item.scaleY = 0.5;
            item.setBounce(0);
            item.setFriction(0.2); // Adjust the friction value
            item.body.setAllowGravity(true);
            //this.physics.world.enable(item);

            // Customize properties for the spawned item if needed
            // item.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            //item.setBounceY(0.01);
            item.setCollideWorldBounds(true);
            // item.body.setCircle(item.width / 2); // Set a circular physics body
            //item.body.setCircle(item.width / 2, 0, (item.height / 2) - (item.width / 2));
            //item.setAngularVelocity(Phaser.Math.Between(-100, 100)); // Allow rotation
        }

        // Check if items in the group are moving
        
        if (itemsGroup.countActive() === 0 || itemsGroup.getChildren().length <= 0) {
            // Stop animation B and start animation A
            console.log("empty")
            catIdle.setVisible(true);
            catFeed.setVisible(false);
            clearTimeout(isFeed)
        } else {
            isFeed = setTimeout(()=> {
                return new Promise((res, rej) => { 
                    if (itemsGroup.countActive() === 0 || itemsGroup.getChildren().length <= 0) { 
                        rej();
                    } else { item.destroy(); res(); }
                })
                .then(() => { 
                    if(hunger > 100) {
                        $("#state").html("Full !!");
                        gameOver();
                    } else {
                        hunger = hunger + 0.2; 
                        console.log(hunger);
                        $('#hunger').css({"width":`${hunger}%`})
                    }
                });
            },5000);
            setTimeout(() => {
                catIdle.setVisible(false);
                catFeed.setVisible(true);
            }, 2000)
        }

            // itemsGroup.children.iterate(function (item) {
            // if (item.body.velocity.y == 0 && item.body.y > foodContainerY1
            //     && item.body.x > foodContainerX1 && item.body.x < foodContainerX2) {
            //     console.log("full")
            //     console.log('Item is moving!');
            //     if (itemsGroup.getChildren().length > 0) {
            //         // Iterate through each child and remove them
            //         itemsGroup.getChildren().forEach(function (child) {
            //             setInterval(()=> {
            //                 child.destroy();
            //             },2000)
            //         });
            //         catIdle.setVisible(false);
            //         catFeed.setVisible(true);
            //     } else {
                    
            //         catIdle.setVisible(true);
            //         catFeed.setVisible(false);
            //     }
            // } else {
            //     catIdle.setVisible(true);
            //     catFeed.setVisible(false);
            // }
            // });
        
    }

}

const config = {
    type: Phaser.AUTO,
    width: gamecontainer.clientWidth,
    height: gamecontainer.clientHeight,
    scene: Example,
    //zoom: 5,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug:true
        }
    },
    parent: 'phaser-container'
};

const game = new Phaser.Game(config);


function gameOver() {
	if(gameState == 1) {

		// $('#end-overlay').css({'display': 'flex'}); 
		gameState = 0; 
	  
		return new Promise ((res, rej) => {
		  $.ajax({
			url: "/setPet",
			method: "POST",  
			data: {
				action: "hunger",
			},
			cache: false,
			success: function(data){
                alert("setpet: " + data)
			    res()
		
			},
			error: function(errMsg) {
				alert(JSON.stringify(errMsg));
				res()
			}
		  });
		})
		.catch((result) => {
		  alert(JSON.stringify(result));
		});
	}
}

/*
 * HANDTRACK.JS ***************************************************************************************
 */

/*
// Get references to video and canvas elements
const video = document.getElementById('video');
//const canvas = document.getElementById('canvas');
//const ctx = canvas.getContext('2d');

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
*/