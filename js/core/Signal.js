//-- A very simple signal implementation
lib.Signal = function() {
    this._bindings = [],
    this.value = null;
}

lib.Signal.prototype = {

    constructor: lib.Signal,

    dispatch: function() {
        var i = this._bindings.length,
            binding;
        while (i--) {
            binding = this._bindings[i];
            binding.callback.apply(binding.context, arguments);
            if (binding.once) this.remove(binding.callback);
        }
        this.value = arguments;
    },

    //-- add a callback, context is optional
    add: function(callback, context) {
        this._bindings.push({
            callback: callback,
            context: (typeof context != 'undefined') ? context : null
        });
    },

    //-- add a callback, context is optional
    addOnce: function(callback, context) {
        this._bindings.push({
            once: true,
            callback: callback,
            context: (typeof context != 'undefined') ? context : null
        });
    },

    //-- remove a callback
    remove: function(callback) {
        var i = this._bindings.length;
        while (i--) {
            if (this._bindings[i].callback == callback) {
                this._bindings.splice(i, 1);
            }
        }
    },

    //-- delete all existing bindings
    removeAll: function() {
        this._bindings.splice(0, this._bindings.length);
    },

    //--
    dispose: function() {
        this._bindings = null;
    }
}