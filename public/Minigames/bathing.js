(window.innerHeight > window.innerWidth) ? $('#phaser-container').css({'width':'100%'}) : $('#phaser-container').css({'width':'80vh'});

const gamecontainer = document.getElementById('phaser-container');
var soapX = null;
var soapY = null;

var handBox = null;
var scale = gamecontainer.clientWidth / gamecontainer.clientHeight;
var washCount = 0;

$('#video').css({
    'opacity':'25%',
    'height': gamecontainer.clientHeight,
    'width': gamecontainer.clientWidth,
    'position': 'absolute',
    '-webkit-transform': 'scaleX(-1)',
    'transform': 'scaleX(-1)'
});

/*
var dogX = null;

var setX = setInterval(() => {// min and max included 
    var min = 1;
    var max = 600;
    dogX = Math.floor(Math.random() * (max - min + 1) + min);
    console.log(dogX);
}, 100); 
*/

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

        //this.load.image('sky', 'assets/skies/space3.png');
        //this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        //this.load.image('red', 'assets/particles/red.png');
    }

    create ()
    {
        const background = this.add.tileSprite(0, 0, gamecontainer.clientWidth, gamecontainer.clientHeight, 'background');

        // Set the tile sprite's origin to the top-left corner
        background.setOrigin(0, 0);

        // Make the background repeat horizontally and vertically
        background.setTileScale(1, 1); // Adjust the scaling as needed

        const stool = this.physics.add.image(gamecontainer.clientWidth / 2,window.innerHeight / 2,'stool');
        stool.setCollideWorldBounds(true);
        stool.scaleX = 8;
        stool.scaleY = 8;

        //const bathroom = this.add.image(window.innerWidth / 2,window.innerHeight / 2,'bathroom');
        const cat = this.physics.add.image(gamecontainer.clientWidth / 2, 0,'cat');
        cat.setCollideWorldBounds(true);
        cat.scaleX = 8;
        cat.scaleY = 8;
        
        const soap = this.add.image(gamecontainer.clientWidth / 2, gamecontainer.clientHeight / 2,'soap');
        soap.scaleX = 0.5;
        soap.scaleY = 0.5;

        
        const love = this.add.image(gamecontainer.clientWidth / 2 - cat.width, gamecontainer.clientHeight / 2 - (cat.height * 6),'love');
        love.scaleX = 5;
        love.scaleY = 5;
        love.setVisible(false);

        this.input.keyboard.on('keydown-W', () => {
            soap.y -= 10;
            //poo.setDisplaySize(300, 600);
        });
        this.input.keyboard.on('keydown-A', () => {
            soap.x -= 10;
            //poo.setDisplaySize(300, 600);
        });
        this.input.keyboard.on('keydown-S', () => {
            soap.y += 10;
            //poo.setDisplaySize(300, 600);
        });
        this.input.keyboard.on('keydown-D', () => {
            soap.x += 10;
            //poo.setDisplaySize(300, 600);
        });
        this.input.keyboard.on('keydown-X', () => {
            soap.displayWidth += 10;
            //poo.setDisplaySize(300, 600);
        });
        this.input.keyboard.on('keydown-Z', () => {
            soap.displayWidth -= 10;
            //poo.setDisplaySize(300, 600);
        });
        
        const particles = this.add.particles(0, 0, 'bubble', {
            follow: soap,
            speed: 100,
            scale: { start: 0.2, end: 0 },
            blendMode: 'ADD'
        });

        this.time.addEvent({
            delay: 100,  // 1000ms (1 second)
            loop: true,   // Set to true for the timer to repeat
            callback: () => {
                if(handBox !== "face" && handBox !== null ) {
                    soap.x = soapX;
                    soap.y = soapY;
                    washCount++;
                    console.log(washCount);
                    if(washCount == 150) {
                        love.setVisible(true);
                        
                        $('#score-modal').modal('show');
                    }
                    
                }
            },
            callbackScope: this,
        });

        const collider = this.physics.add.collider(cat, stool, null, () =>
        {
            //this.physics.world.removeCollider(collider);
        });
    }

    update() {
        

        /*This method should be overridden by your own Scenes.

        This method is called once per game step while the scene is running.*/

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
            gravity: { y: 200 },
            debug:true
        }
    },
    parent: 'phaser-container'
};

const game = new Phaser.Game(config);

/*
 * HANDTRACK.JS ***************************************************************************************
 */


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
