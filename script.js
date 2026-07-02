let x = 10;
let y = 10;
let img = "pinguim.png";

let frameHeight = 180 / 3;
let frameWidth = 600 / 8;
// top row = 0, mid row = 1, bot row = 2


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

const image = new Image();
image.src = img;

// function draw() {
//     ctx.fillRect(10, 10, 50, 50);

//     ctx.fillStyle = "rgba(0, 68, 255, 0.5)";
//     ctx.fillRect(30, 30, 50, 50);
// }
// draw();

function gameLoop() {
    if (rightPressed) x += 2;
    if (leftPressed) x -= 2;
    if (upPressed) y -= 2;
    if (downPressed) y += 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // ctx.fillStyle = "rgba(255, 0, 157, 1)";
    // ctx.fillRect(x, y, 50, 50);

    let sourceY = frameHeight * 1;

    let frame = 0;
    let sourceX = frame * frameWidth;

    ctx.drawImage(image, sourceX, sourceY, frameWidth, frameHeight, x, y, frameWidth, frameHeight);

    requestAnimationFrame(gameLoop);
}
gameLoop();

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