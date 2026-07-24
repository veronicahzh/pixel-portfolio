export function loadImage(src) {
    const image = new Image();
    image.src = `${src}?v=${Date.now()}`;
    return image;
}
