export const keys = {
    right: false,
    left: false,
    up: false,
    down: false
};

export function setupInput() {
    document.addEventListener("keydown", function(event) {
        updateKey(event.key, true);
    });

    document.addEventListener("keyup", function(event) {
        updateKey(event.key, false);
    });
}

function updateKey(key, isPressed) {
    if (key === "ArrowRight") {
        keys.right = isPressed;
    } else if (key === "ArrowLeft") {
        keys.left = isPressed;
    } else if (key === "ArrowUp") {
        keys.up = isPressed;
    } else if (key === "ArrowDown") {
        keys.down = isPressed;
    }
}
