let x = 10;
let y = 10;
let img = "pinguim.png";

const tileset = new Image();
tileset.src = "placeholder_tileset.png";

const slotWidth = 60; // how far apart each frame starts
const frameHeight = 60;
const frameWidth = 60; // how much is cropped
const row = 1;

let frame = 7;
// top row = 0, mid row = 1, bot row = 2
let sourceY = row * frameHeight;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

let frameTimer = 0; // how many game loop frames have passed
let frameDelay = 8; // how long to wait before switching to next sprite frame

const image = new Image();
image.src = img;

// const obstacle = {
//     x: 100,
//     y: 100,
//     width: 60,
//     height: 40
// }

const player = {
    x: x,
    y: y,
    width: frameWidth,
    height: frameHeight
}

// function draw() {
//     ctx.fillRect(10, 10, 50, 50);

//     ctx.fillStyle = "rgba(0, 68, 255, 0.5)";
//     ctx.fillRect(30, 30, 50, 50);
// }
// draw();

function gameLoop() {
    let prevX = player.x;
    let prevY = player.y;

    let isMoving = rightPressed || leftPressed || upPressed || downPressed;

    if (isMoving) {
        updateFrame();
    }
    else {
        frame = 0;
    }

    let sourceX = frame * slotWidth;

    if (rightPressed) x += 2;
    if (leftPressed) x -= 2;
    if (upPressed) y -= 2;
    if (downPressed) y += 2;

    player.x = x;
    player.y = y;

    // if (isColliding(player, obstacle)) {
    //     x = prevX;
    //     y = prevY;
    //     player.x = x;
    //     player.y = y;
    // }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // erase old sprite

    drawMap();

    // ctx.fillStyle = "gray";
    // ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    ctx.drawImage(
        image, 
        sourceX, sourceY, frameWidth, frameHeight, 
        x, y, frameWidth, frameHeight);

        ctx.strokeStyle = "red";
        ctx.strokeRect(x, y, frameWidth, frameHeight);

    requestAnimationFrame(gameLoop);
}
gameLoop();

function drawMap() {
    for (let i = 0; i < mapData.length; i++) {
        const tile = mapData[i];

        if (tile === 0) continue;

        const col = i % mapWidth;
        const row = Math.floor(i / mapWidth);

        const screenX = col * tileSize;
        const screenY = row * tileSize;

        const tileIndex = tile - 1;
        const tileSrcX = tileIndex * tileSize;
        const tileSrcY = 0;

        ctx.drawImage(
            tileset,
            tileSrcX, tileSrcY, tileSize, tileSize,
            screenX, screenY, tileSize, tileSize
        )
    }
}

function updateFrame() {
    frameTimer++;

    if (frameTimer >= frameDelay) {
        if (frame < 7) {
            frame++;
        } else {
            frame = 0;
        }

        frameTimer = 0;
    }
}

function isColliding(a, b) {
    return (
        a.x + a.width > b.x &&
        b.x + b.width > a.x &&
        a.y + a.height > b.y &&
        b.y + b.height > a.y
    )
}

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowRight") {
        rightPressed = true;
    } else if (event.key === "ArrowLeft") {
        leftPressed = true;
    } else if (event.key === "ArrowUp") {
        upPressed = true;
    } else if (event.key === "ArrowDown") {
        downPressed = true;
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key === "ArrowRight") {
        rightPressed = false;
    } else if (event.key === "ArrowLeft") {
        leftPressed = false;
    } else if (event.key === "ArrowUp") {
        upPressed = false;
    } else if (event.key === "ArrowDown") {
        downPressed = false;
    }
});
