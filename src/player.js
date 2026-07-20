const slotWidth = 60;
const frameHeight = 60;
const frameWidth = 60;
const row = 1;
const speed = 2;
const frameDelay = 8;
const maxFrame = 7;

export function createPlayer(image) {
    return {
        x: 10,
        y: 10,
        width: frameWidth,
        height: frameHeight,
        image: image,
        frame: maxFrame,
        frameTimer: 0,
        sourceY: row * frameHeight
    };
}

export function updatePlayer(player, keys) {
    const isMoving = keys.right || keys.left || keys.up || keys.down;

    if (isMoving) {
        updateFrame(player);
    } else {
        player.frame = 0;
    }

    if (keys.right) player.x += speed;
    if (keys.left) player.x -= speed;
    if (keys.up) player.y -= speed;
    if (keys.down) player.y += speed;
}

export function drawPlayer(ctx, player) {
    const sourceX = player.frame * slotWidth;

    ctx.drawImage(
        player.image,
        sourceX, player.sourceY, frameWidth, frameHeight,
        player.x, player.y, frameWidth, frameHeight
    );

    ctx.strokeStyle = "red";
    ctx.strokeRect(player.x, player.y, frameWidth, frameHeight);
}

function updateFrame(player) {
    player.frameTimer++;

    if (player.frameTimer >= frameDelay) {
        if (player.frame < maxFrame) {
            player.frame++;
        } else {
            player.frame = 0;
        }

        player.frameTimer = 0;
    }
}
