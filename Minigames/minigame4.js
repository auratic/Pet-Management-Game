class Example extends Phaser.Scene {

    preload() {
        this.load.image('pacman', 'path_to_pacman_image.png');
        this.load.image('pellet', 'path_to_pellet_image.png');
        this.load.image('wall', 'Assets/stool.png');
        // Load additional assets like ghosts, background, etc.
    }

    create() {
        // Create Pac-Man
        this.pacman = this.physics.add.sprite(50, 100, 'pacman');
        this.pacman.setOrigin(0, 0);

        // Create Pellets
        this.pellets = this.physics.add.group();
        for (let i = 0; i < 10; i++) {
            let x = Phaser.Math.Between(0, 750);
            let y = Phaser.Math.Between(0, 750);
            let pellet = this.pellets.create(x, y, 'pellet');
            pellet.setOrigin(0, 0);
        }

        // Create Walls (Maze boundaries)
        this.walls = this.physics.add.staticGroup(); // Initialize walls as a static group

        // Create Maze using Recursive Backtracking algorithm
        const maze = this.generateMaze(20, 20); // Adjust the maze dimensions as needed
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                if (maze[y][x] === 1) {
                    this.createWall(x * 40, y * 40, 40, 40);
                }
            }
        }
        // Define keyboard inputs for movement
        this.cursors = this.input.keyboard.createCursorKeys();

        // Set world bounds for collision
        this.physics.world.setBounds(0, 0, 800, 600);
        this.physics.add.collider(this.pacman, this.walls);
    }

    update() {
        // Pac-Man movement logic

        // Pac-Man collision with walls is handled using collider

        // Collision with pellets handled in collectPellet function
   
        if (this.cursors.left.isDown) {
            this.pacman.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.pacman.setVelocityX(160);
        } else {
            this.pacman.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
            this.pacman.setVelocityY(-160);
        } else if (this.cursors.down.isDown) {
            this.pacman.setVelocityY(160);
        } else {
            this.pacman.setVelocityY(0);
        }

        this.physics.world.wrap(this.pacman, 0);
        this.physics.add.overlap(this.pacman, this.pellets, this.collectPellet, null, this);
    }

    generateMaze(width, height) {

        //https://shaunlebron.github.io/pacman-mazegen/
        
         // Generate the maze using Recursive Backtracking with a solvable path
         const maze = [];
         for (let y = 0; y < height; y++) {
             maze[y] = [];
             for (let x = 0; x < width; x++) {
                 maze[y][x] = 1;
             }
         }
 
         const stack = [];
         let x = 0;
         let y = 0;
 
         maze[y][x] = 0;
 
         do {
             const neighbors = [];
 
             if (x - 2 > 0 && maze[y][x - 2] === 1) {
                 neighbors.push({ x: x - 2, y });
             }
             if (x + 2 < width && maze[y][x + 2] === 1) {
                 neighbors.push({ x: x + 2, y });
             }
             if (y - 2 > 0 && maze[y - 2][x] === 1) {
                 neighbors.push({ x, y: y - 2 });
             }
             if (y + 2 < height && maze[y + 2][x] === 1) {
                 neighbors.push({ x, y: y + 2 });
             }
 
             if (neighbors.length) {
                 stack.push({ x, y });
 
                 const next = Phaser.Utils.Array.GetRandom(neighbors);
                 maze[next.y][next.x] = 0;
                 x = next.x;
                 y = next.y;
             } else if (stack.length > 0) {
                 const last = stack.pop();
                 x = last.x;
                 y = last.y;
             }
         } while (stack.length > 0);
 
         // Ensure entrance and exit are open
         maze[0][1] = 0;
         maze[height - 1][width - 2] = 0;
 
         return maze;
    }

    createWall(x, y, width, height) {
        this.walls.create(x, y, 'wall').setOrigin(0, 0).setDisplaySize(width, height).refreshBody();
    }

    collectPellet(pacman, pellet) {
        pellet.disableBody(true, true);
        // Implement scoring or other actions when Pac-Man collects a pellet
    }
}


const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: Example,
    parent: 'phaser-container'
};

const game = new Phaser.Game(config);


