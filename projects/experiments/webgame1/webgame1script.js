// board 

let board;
let boardWith = 360;
let boardHeight = 640;
let context;

// bird

let birdWith = 34; // width / heoght ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWith/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWith,
    height : birdHeight
}

// pipes

let pipeArray = [];
let pipeWidth = 64; // width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWith;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// physics 

let velocityX = -2; // pipes moving left speed
let velocityY = 0; // bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWith;
    context = board.getContext("2d"); // used for drawing on the board

    // draw flappy bird 

    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load image

    birdImg = new Image();
    birdImg.src = "addons/flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "addons/toppipe.png"

    bottomPipeImg = new Image();
    bottomPipeImg.src = "addons/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); // every 1.5s
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);
    
    if (gameOver) {
        return;
    }
    
    context.clearRect(0, 0, board.width, board.height);

    // bird

    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); // apply gravity to current bird.y or check for top canvas limit
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    // pipes 

    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; // because there are 2 pipes and 0.5 * 2 = 1 --> 1 for each pait of pipes
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); // removes first element from array
    }

    // score 

    context.fillStyle = "white";
    context.font = "45px sans-serif"
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90)
    }
}

function placePipes() {

    if (gameOver) {
        return;
    }

    // 0-1 * pipeHeight / 2
    // 0 --> -128px (pipeHeight / 4)
    // 1 --> -128 - 256 (pipeHeight / 4 - pipeHeight / 2) = - 3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg, 
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        height : pipeHeight,
        width : pipeWidth,
        passed : false
    }

    pipeArray.push(bottomPipe);

}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump

        velocityY = -6;

        //reset game 

        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

// collision check

function detectCollision(a, b) {
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}

// ----------------------------------------------------- BEST SCORE
