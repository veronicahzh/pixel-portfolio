import { loadImage } from "./assets.js";
import { setupCanvas } from "./canvas.js";
import { setupInput, keys } from "./input.js";
import { drawMap } from "./map.js";
import { createPlayer, drawPlayer, updatePlayer } from "./player.js";
import { floorDecals, props, lights } from "../data/decor.js";

const canvasSetup = setupCanvas("canvas");
const canvas = canvasSetup.canvas;
const ctx = canvasSetup.ctx;

ctx.imageSmoothingEnabled = false;

const tileset = loadImage("cozy/cozy_room_tiles.png");
const playerImage = loadImage("pinguim.png");
const player = createPlayer(playerImage);

const bookshelfImage = loadImage("bookshelf2.png");
const resumeDeskImage = loadImage("resume_desk2.png");
const deskImage = loadImage("desk2.png");
const phoneDeskImage = loadImage("phone_desk3.png");

const pickSrc = (item) =>
    item.variants ? item.variants[Math.floor(Math.random() * item.variants.length)] : item.src;
const withImage = (list) => list.map((item) => ({ ...item, image: loadImage(pickSrc(item)) }));
const floorDecalItems = withImage(floorDecals);
const propItems = withImage(props);
const lightItems = withImage(lights);

function drawItems(items) {
    for (const item of items) {
        if (item.image.complete && item.image.width > 0) {
            ctx.drawImage(item.image, item.x, item.y);
        }
    }
}

setupInput();

function gameLoop() {
    updatePlayer(player, keys);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap(ctx, tileset);
    drawItems(floorDecalItems);
    ctx.drawImage(deskImage, 36, 27, 96, 80);
    ctx.drawImage(bookshelfImage, 317, 20, 128, 64);
    ctx.drawImage(phoneDeskImage, 35, 156, 64, 48);
    ctx.drawImage(resumeDeskImage, 381, 159, 64, 48);
    drawItems(propItems);
    drawPlayer(ctx, player);
    drawItems(lightItems);

    requestAnimationFrame(gameLoop);
}

gameLoop();
