
var gamepadMaster = null;
var glMaster = null;

function init() {
    gamepadMaster = new GamepadMaster();
    glMaster = new GlMaster('gameView');

    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    if(gamepadMaster && glMaster) {
        gamepadMaster.getGpData();
        glMaster.draw(gamepadMaster.isLeftPressed, gamepadMaster.isRightPressed);
    }

    requestAnimationFrame(gameLoop);
}

window.onload = function() {
    init();
}