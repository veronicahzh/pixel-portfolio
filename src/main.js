import { loadImage } from "./assets.js";
import { setupCanvas } from "./canvas.js";
import { isColliding } from "./collision.js";
import { setupInput, keys } from "./input.js";
import { createPlayer, drawPlayer, updatePlayer, getFeetBox } from "./player.js";
import { loadTiledMap, lookupGid, drawTileLayer, drawObject } from "./tiled.js";

const canvasSetup = setupCanvas("canvas");
const canvas = canvasSetup.canvas;
const ctx = canvasSetup.ctx;

ctx.imageSmoothingEnabled = false;

// add ?player=penguin to the address to test with the penguin
const playerName = new URLSearchParams(window.location.search).get("player") || "veronica";
const player = createPlayer(playerName);

// Every visit shows one of the three cats
const catVariants = [
    "cozy/props/cat_bed_orange_tabby.png",
    "cozy/props/cat_bed_grey_tabby.png",
    "cozy/props/cat_bed_white_longhair.png"
];
const randomCat = loadImage(catVariants[Math.floor(Math.random() * catVariants.length)]);

function imageFor(map, object) {
    const tile = lookupGid(map, object.gid);
    if (tile && tile.src && tile.src.endsWith("cat_bed.png") && randomCat.complete) {
        return randomCat;
    }
    return null;
}

function drawObjectLayer(map, layer) {
    let objects = layer.objects.filter((object) => object.gid && object.visible !== false);
    if (layer.draworder === "topdown") {
        objects = [...objects].sort((a, b) => a.y - b.y);
    }
    for (const object of objects) {
        drawObject(ctx, map, object, imageFor(map, object));
    }
}

function drawRoom(map) {
    for (const layer of map.layers) {
        if (layer.visible === false) continue;

        if (layer.type === "tilelayer") {
            drawTileLayer(ctx, map, layer);
        } else if (layer.type === "objectgroup") {
            drawObjectLayer(map, layer);
        }

        // the player walks in front of the furniture, under the lights
        if (layer.name === "furniture") {
            drawPlayer(ctx, player);
        }
    }
}

function getCollisionBoxes(map) {
    const layer = map.layers.find((layer) => layer.name === "collision");
    if (!layer) return [];
    return layer.objects.map((object) => ({
        x: object.x,
        y: object.y,
        width: object.width,
        height: object.height
    }));
}

function getInteractionZones(map) {
    const layer = map.layers.find((layer) => layer.name === "interactions");
    if (!layer) return [];
    return layer.objects.map((object) => ({
        name: object.name,
        x: object.x,
        y: object.y,
        width: object.width,
        height: object.height
    }));
}

function findZone(player, zones) {
    for (const zone of zones) {
        if (isColliding(getFeetBox(player, player.x, player.y), zone)) {
            return zone;
        }
    }
    return null;
}

async function start() {
    const map = await loadTiledMap("cozy_room.tmj");
    const boxes = getCollisionBoxes(map);
    const zones = getInteractionZones(map);
    setupInput();

    let lastZone = null;
    function gameLoop() {
        updatePlayer(player, keys, boxes);

        const nearby = findZone(player, zones);
        const name = nearby ? nearby.name : null;
        if (name !== lastZone) {
            console.log("now at: ", name);
            lastZone = name;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRoom(map);
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}

start();
