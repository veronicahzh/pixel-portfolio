import { loadImage } from "./assets.js";
import { isColliding } from "./collision.js";

const debug = new URLSearchParams(window.location.search).has("debug");
const speed = 2;
const walkDelay = 6;
const idleDelay = 14;

// Each character: where its idle and walk frames are, and which way the art faces.
const characters = {
    veronica: {
        size: 32,
        idle: { image: "veronica_idle.png", columns: 1, frames: 1 },
        walk: { image: "veronica_walk.png", columns: 3, frames: 8 },
        facesRight: true
    },
    penguin: {
        size: 60,
        idle: { image: "pinguim.png", columns: 10, frames: 4, row: 0 },
        walk: { image: "pinguim.png", columns: 10, frames: 8, row: 1 },
        facesRight: true
    }
};

function loadAnimation(animation) {
    return { ...animation, image: loadImage(animation.image) };
}

export function createPlayer(name) {
    const character = characters[name] || characters.veronica;

    return {
        x: 224,
        y: 130,
        size: character.size,
        idle: loadAnimation(character.idle),
        walk: loadAnimation(character.walk),
        facesRight: character.facesRight,
        facingLeft: false,
        moving: false,
        frame: 0,
        frameTimer: 0
    };
}

export function updatePlayer(player, keys, boxes) {
    const isMoving = keys.right || keys.left || keys.up || keys.down;

    if (isMoving !== player.moving) {
        player.moving = isMoving;
        player.frame = 0;
        player.frameTimer = 0;
    }

    if (keys.right) player.facingLeft = false;
    if (keys.left) player.facingLeft = true;

    updateFrame(player);

    if (keys.right && !hitsAnything(getFeetBox(player, player.x + speed, player.y), boxes)) player.x += speed;
    if (keys.left && !hitsAnything(getFeetBox(player, player.x - speed, player.y), boxes)) player.x -= speed;
    if (keys.up && !hitsAnything(getFeetBox(player, player.x, player.y - speed), boxes)) player.y -= speed;
    if (keys.down && !hitsAnything(getFeetBox(player, player.x, player.y + speed), boxes)) player.y += speed;
}

export function drawPlayer(ctx, player) {
    const animation = player.moving ? player.walk : player.idle;
    const size = player.size;
    const column = player.frame % animation.columns;
    const row = (animation.row || 0) + Math.floor(player.frame / animation.columns);
    const flip = player.facingLeft === player.facesRight;

    ctx.save();
    if (flip) {
        ctx.translate(player.x + size, player.y);
        ctx.scale(-1, 1);
    } else {
        ctx.translate(player.x, player.y);
    }
    ctx.drawImage(animation.image, column * size, row * size, size, size, 0, 0, size, size);
    ctx.restore();

    if (debug) {
        const feet = getFeetBox(player, player.x, player.y);
        ctx.strokeStyle = "red";
        ctx.strokeRect(feet.x, feet.y, feet.width, feet.height);
    }
}

export function getFeetBox(player, x, y) {
    return {
        x: x + 10,
        y: y + 26,
        width: 12,
        height: 5
    };
}

function hitsAnything(box, boxes) {
    for (const other of boxes) {
        if (isColliding(box, other)) {
            return true;
        }
    }
    return false;
}

function updateFrame(player) {
    const animation = player.moving ? player.walk : player.idle;
    const delay = player.moving ? walkDelay : idleDelay;

    player.frameTimer++;
    if (player.frameTimer >= delay) {
        player.frame = (player.frame + 1) % animation.frames;
        player.frameTimer = 0;
    }
}
