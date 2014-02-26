var EventEmitter = {
    on: function(eventName, handler) {
        if (!this.__handlers)
            this.__handlers = {};
        if (!this.__handlers[eventName])
            this.__handlers[eventName] = [];
        this.__handlers[eventName].push(handler);
    },
    off: function(eventName, handler) {
        if (this.__handlers && this.__handlers[eventName]) {
            var idx = this.__handlers[eventName].indexOf(handler)
            if (idx > -1)
                this.__handlers[eventName].splice(idx, 1);
        }
    },
    once: function(eventName, handler) {
        this.on(eventName, function fn() {
            this.off(eventName, fn);
            handler();
        });
    },
    emit: function(eventName) {
        var args = Array.prototype.slice.call(arguments, 1);
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