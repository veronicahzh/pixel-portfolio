import { mapData, mapWidth, tileSize } from "../data/mapData.js";

export function drawMap(ctx, tileset) {
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
        );
    }
}
