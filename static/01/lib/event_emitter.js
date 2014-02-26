function EventEmitter = {
    on: function(eventName, handler) {
        if (!this.__handlers)
            this.__handlers = {};
        if (!this.__handlers[eventName])
            this.__handlers[eventName] = [];
        this.__handlers[eventName].push(handler);
    },
    off: function(eventName, handler) {
        if (this.__handlers && this.__handlers[eventName]) {
            this.__handlers[eventName] = this.__handlers[eventName].filter(function(fn) {
                return fn !== handler;
            });
        }
    },
    emit: function(eventName) {
        var args = Array.prototype.slice.apply(arguments, 1);
        if (this.__handlers && this.__handlers[eventName]) {
            this.__handlers[eventName].forEach(function(fn) {
                fn.apply(null, args);
            });
        }
    },
    mixin: function(object) {
        object.on   = this.on;
        object.off  = this.off;
        object.emit = this.emit;
    }
};