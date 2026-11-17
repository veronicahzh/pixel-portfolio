// Loads a map saved from Tiled (.tmj) together with its external tilesets (.tsx)

const FLIP_FLAGS = 0xe0000000;

function folderOf(path) {
    const slash = path.lastIndexOf("/");
    return slash === -1 ? "" : path.slice(0, slash + 1);
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Could not load ${src}`));
        image.src = src;
    });
}

async function loadTileset(ref, mapFolder) {
    const tsxPath = mapFolder + ref.source;
    const text = await (await fetch(tsxPath, { cache: "no-cache" })).text();
    const xml = new DOMParser().parseFromString(text, "application/xml");
    const root = xml.querySelector("tileset");
    const tsxFolder = folderOf(tsxPath);

    const tileset = {
        firstgid: ref.firstgid,
        tileWidth: Number(root.getAttribute("tilewidth")),
        tileHeight: Number(root.getAttribute("tileheight")),
        columns: Number(root.getAttribute("columns")),
        sheet: null,       // one image cut into a grid (room tiles)
        images: new Map()  // one image per tile (props, furniture)
    };

    const sheetImage = root.querySelector(":scope > image");
    if (sheetImage) {
        tileset.sheet = await loadImage(tsxFolder + sheetImage.getAttribute("source"));
    } else {
        const loads = [...root.querySelectorAll(":scope > tile")].map(async (tile) => {
            const image = tile.querySelector("image");
            if (!image) return;
            const src = tsxFolder + image.getAttribute("source");
            tileset.images.set(Number(tile.getAttribute("id")), { src, image: await loadImage(src) });
        });
        await Promise.all(loads);
    }

    return tileset;
}

export async function loadTiledMap(path) {
    const map = await (await fetch(path, { cache: "no-cache" })).json();
    const mapFolder = folderOf(path);
    const tilesets = await Promise.all(map.tilesets.map((ref) => loadTileset(ref, mapFolder)));
    tilesets.sort((a, b) => a.firstgid - b.firstgid);
    return { ...map, tilesets };
}

// Finds which tileset a gid belongs to and returns what to draw for it
export function lookupGid(map, rawGid) {
    const gid = rawGid & ~FLIP_FLAGS;
    let tileset = null;
    for (const ts of map.tilesets) {
        if (ts.firstgid <= gid) tileset = ts;
    }
    if (!tileset) return null;

    const id = gid - tileset.firstgid;
    if (tileset.sheet) {
        return {
            image: tileset.sheet,
            sx: (id % tileset.columns) * tileset.tileWidth,
            sy: Math.floor(id / tileset.columns) * tileset.tileHeight,
            sw: tileset.tileWidth,
            sh: tileset.tileHeight
        };
    }

    const tile = tileset.images.get(id);
    if (!tile) return null;
    return { image: tile.image, src: tile.src, sx: 0, sy: 0, sw: tile.image.width, sh: tile.image.height };
}

export function drawTileLayer(ctx, map, layer) {
    for (let i = 0; i < layer.data.length; i++) {
        if (layer.data[i] === 0) continue;
        const tile = lookupGid(map, layer.data[i]);
        if (!tile) continue;
        const x = (i % layer.width) * map.tilewidth;
        const y = Math.floor(i / layer.width) * map.tileheight;
        ctx.drawImage(tile.image, tile.sx, tile.sy, tile.sw, tile.sh, x, y, map.tilewidth, map.tileheight);
    }
}

// Tile objects in Tiled are positioned by their bottom-left corner
export function drawObject(ctx, map, object, imageOverride) {
    const tile = lookupGid(map, object.gid);
    if (!tile) return;
    const image = imageOverride || tile.image;
    const x = Math.round(object.x);
    const y = Math.round(object.y - object.height);
    if (imageOverride) {
        ctx.drawImage(image, x, y);
    } else {
        ctx.drawImage(image, tile.sx, tile.sy, tile.sw, tile.sh, x, y, Math.round(object.width), Math.round(object.height));
    }
}
