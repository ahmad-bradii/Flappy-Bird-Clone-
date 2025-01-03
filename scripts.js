let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const stages = {
    1: {
        topColumns: {
            height: -200,
            space: 200
        },
        bottomColumns: {
            height: 200,
            space: 200
        }
    },
    2: {
        topColumns: {
            height: -100,
            space: 200
        },
        bottomColumns: {
            height: 300,
            space: 200
        }
    },
    3: {
        topColumns: {
            height: -400,
            space: 200
        },
        bottomColumns: {
            height: 400,
            space: 200
        }
    },
    4: {
        topColumns: {
            height: -450,
            space: 200
        },
        bottomColumns: {
            height: 450,
            space: 200
        }
    },
    5: {
        topColumns: {
            height: -500,
            space: 200
        },
        bottomColumns: {
            height: 500,
            space: 200
        }
    }
};

let numberColumn = 15;
let stage = 2;
let game = new Phaser.Game(config);
let bird;
let hasLanded = false;
let cursors;
let hasBumped = false;

let isGameStarted = false;
let messageToPlayer;

// Global variables for columns and score
let topColumns;
let bottomColumns;
let score = 0;
let scoreText;

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('road', 'assets/road.png');
    this.load.image('columnNonFlipped', 'assets/pipe-green.png');
    this.load.image('columnFlipped', 'assets/pipe-green-flipped.png');

    this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 64, frameHeight: 96 });
}

function create() {
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    const roads = this.physics.add.staticGroup();

    // Initialize topColumns and bottomColumns as global variables
    topColumns = this.physics.add.group({
        allowGravity: false // Disable gravity for all columns in the group
    });

    bottomColumns = this.physics.add.group({
        allowGravity: false // Disable gravity for all columns in the group
    });

    // Add a finite number of columns to the group
    for (let i = 0; i < numberColumn; i++) {
        let topColumn = topColumns.create(700 + i * 200, stages[stage].topColumns.height, 'columnFlipped');
        topColumn.setOrigin(0, 0);
        topColumn.setVelocityX(0); // Set initial velocity to 0

        let bottomColumn = bottomColumns.create(800 + i * 200, stages[stage].bottomColumns.height, 'columnNonFlipped');
        bottomColumn.setOrigin(0, 0);
        bottomColumn.setVelocityX(0); // Set initial velocity to 0
    }

    const road = roads.create(400, 568, 'road').setScale(2).refreshBody();

    bird = this.physics.add.sprite(0, 50, 'bird').setScale(2);
    bird.setBounce(0.2);
    bird.setCollideWorldBounds(true);

    this.physics.add.overlap(bird, road, () => hasLanded = true, null, this);
    this.physics.add.collider(bird, road);

    this.physics.add.overlap(bird, topColumns, () => handleCollision(topColumns, bottomColumns), null, this);
    this.physics.add.overlap(bird, bottomColumns, () => handleCollision(topColumns, bottomColumns), null, this);
    this.physics.add.collider(bird, topColumns);
    this.physics.add.collider(bird, bottomColumns);

    cursors = this.input.keyboard.createCursorKeys();

    messageToPlayer = this.add.text(0, 0, 'Instructions: Press space bar to start', { fontFamily: '"Comic Sans MS", Times, serif', fontSize: "20px", color: "white", backgroundColor: "black" });
    Phaser.Display.Align.In.BottomCenter(messageToPlayer, background, 0, 50);

    // Add score text
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
}

function handleCollision(topColumns,bottomColumns) {
    messageToPlayer.text = 'Oh YES! You crashed!';
    // Stop the bird and columns when a collision occurs
    
    
    hasBumped = true;
    bird.body.velocity.x = 0;
    topColumns.setVelocityX(0);
    bottomColumns.setVelocityX(0);
    

    
    

    
    // Stop all columns
    

    
}

function update() {
    // Check if the spacebar is pressed to start the game
    if ((this.input.activePointer.isDown || cursors.up.isDown) && !isGameStarted) {
        isGameStarted = true;
        messageToPlayer.text = 'Instructions: Press the "^" button or Click to stay upright\nAnd don\'t hit the columns or ground';
    }

    if (!isGameStarted) {
        bird.setVelocityY(-160);
    }

    // Move bird upwards when the mouse is clicked
    if ((this.input.activePointer.isDown || cursors.up.isDown) && !hasLanded && !hasBumped) {
        bird.setVelocityY(-160);
    }

    // Move bird right if game started and it hasn't landed on or bumped into something
    if (isGameStarted && !hasLanded && !hasBumped) {
        bird.body.velocity.x = 50;

        // Start the columns moving when the game starts
        topColumns.getChildren().forEach(column => column.setVelocityX(-70));
        bottomColumns.getChildren().forEach(column => column.setVelocityX(-70));

        // Check if the bird has passed a column and increment the score
        if (bird.x > topColumns.getChildren()[0].x) { // Adjust the condition as needed
            score+=0.0045;
            scoreText.setText('Score: ' + Math.floor(score));

        }
    } else {
        bird.body.velocity.x = 0;
    }

    if (hasLanded || hasBumped) {
        messageToPlayer.text = 'Oh YES! You crashed!';

         // Stop the bird's movement
        topColumns.setVelocityX(0);
        bottomColumns.setVelocityX(0);
    }

// sourcery skip: max-min-identity
    if (bird.x > 300) {
        bird.x = 300;
    }
    if(score === 28){
        messageToPlayer.text = 'Oh NO! You Win!\n WELL PLAYED!!!';
    }
}