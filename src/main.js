import { loadImage } from "./assets.js";
import { setupCanvas } from "./canvas.js";
import { setupInput, keys } from "./input.js";
import { drawMap } from "./map.js";
import { createPlayer, drawPlayer, updatePlayer } from "./player.js";

const canvasSetup = setupCanvas("canvas");
const canvas = canvasSetup.canvas;
const ctx = canvasSetup.ctx;

ctx.imageSmoothingEnabled = false;

const tileset = loadImage("placeholder_tileset.png");
const playerImage = loadImage("pinguim.png");
const player = createPlayer(playerImage);

const bookshelfImage = loadImage("bookshelf.png");

setupInput();

function gameLoop() {
    updatePlayer(player, keys);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap(ctx, tileset);
    ctx.drawImage(bookshelfImage, 239, 35, 64, 64);
    drawPlayer(ctx, player);

    requestAnimationFrame(gameLoop);
}

gameLoop();
