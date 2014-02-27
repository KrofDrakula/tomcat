function GameController() {

}

EventEmitter.mixin(GameController.prototype);

GameController.commands = ['left', 'up', 'right', 'down'];

GameController.prototype.start = function(callback) {
    throw new Exception('Not implemented');
};

GameController.prototype.stop = function() {
    throw new Exception('Not implemented');
};

GameController.prototype.getCommandSet = function() {
    return { left: false, up: false, right: false, down: false };
};



function KeyboardController() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp   = this.handleKeyUp.bind(this);
    this.keysPressed   = [];
}

KeyboardController.prototype = Object.create(GameController.prototype);

KeyboardController.keymap = {
    '37' : 'left',
    '38' : 'up',
    '39' : 'right',
    '40' : 'down'
};

KeyboardController.lookup = {
    left  : '37',
    up    : '38',
    right : '39',
    down  : '40'
};

KeyboardController.validKeys = Object.keys(KeyboardController.keymap);

KeyboardController.prototype.start = function(callback) {
    document.addEventListener('keydown', this.handleKeyDown, true);
    document.addEventListener('keyup',   this.handleKeyUp,   true);
    callback();
};

KeyboardController.prototype.stop = function() {
    document.removeEventListener('keydown', this.handleKeyDown, true);
    document.removeEventListener('keyup',   this.handleKeyUp,   true);
};

KeyboardController.prototype.handleKeyDown = function(ev) {
    var code = ev.keyCode.toString(), idx = this.keysPressed.indexOf(code);
    if (idx == -1 && this.isValidKey(code)) {
        this.keysPressed.push(code);
        this.emit('engage', KeyboardController.keymap[code]);
    }
};

KeyboardController.prototype.handleKeyUp = function(ev) {
    var code = ev.keyCode.toString(), idx = this.keysPressed.indexOf(code);
    if (idx > -1 && this.isValidKey(code)) {
        this.keysPressed.splice(idx, 1);
        this.emit('disengage', KeyboardController.keymap[code]);
    }
};

KeyboardController.prototype.isValidKey = function(code) {
    return KeyboardController.validKeys.indexOf(code) > -1;
}

KeyboardController.prototype.getCommandSet = function() {
    var ret = {};
    GameController.commands.forEach(function(command) {
        ret[command] = this.keysPressed.indexOf(KeyboardController.lookup[command]) > -1;
    }, this);
    return ret;
};