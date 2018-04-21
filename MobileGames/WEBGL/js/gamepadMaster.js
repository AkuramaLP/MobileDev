
function GamepadMaster() {

    var thiz = this;

    var gamepads = [];
    var gamePad = null;

    thiz.isLeftPressed = false;
    thiz.isRightPressed = false;

    function gpConnected(e) {
        console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);
        
        gamePad = navigator.getGamepads()[e.gamepad.index];
        console.log(gamePad);
    }

    function gpDisconnected(e) {
        console.log("Gamepad disconnected from index %d: %s",
            e.gamepad.index, e.gamepad.id);
    }

    thiz.getGpData = function() {
        if(gamepads[1]) {
            thiz.isLeftPressed = (gamepads[1].buttons[18] === 1) ? true : false;
            thiz.isRightPressed = (gamepads[1].buttons[19] === 1) ? true : false;
        }
    }

    function init() {
        window.addEventListener('gamepadconnected', gpConnected);
        window.addEventListener('gamepaddisconnected', gpDisconnected);
        
        gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
    }

    init();

}