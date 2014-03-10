lib.List = function(arr_) {
    this._first = null;
    this._last = null;
    if (arr_) this.appendArray(arr_);
}

lib.List.prototype = {

    prepend: function(data_) {
        var node = {
            data: data_,
            next: this._first,
            prev: null
        };
        this._first ?
            (this._first = this._first.prev = node) :
            (this._last ? (this._first = node) : (this._last = this._first = node));
        return this;
    },

    append: function(data_) {
        var node = {
            data: data_,
            next: null,
            prev: this._last
        };
        this._last ?
            (this._last = this._last.next = node) :
            (this._first ? (this._last = node) : (this._first = this._last = node));
        return this;
    },

    shift: function(func_) {
        if (!this._first) return null;
        var first = this._first;
        this._first = first.next;
        if (this._first) this._first.prev = null;
        else this._last = null; //-- first was also last
        first.next = null; // gc
        return first.data;
    },

    pop: function() {
        if (!this._last) return null;
        var last = this._last;
        this._last = last.prev;
        if (this._last) this._last.next = null;
        else this._first = null; //-- last was also first
        last.prev = null; // gc
        return last.data;
    },

    map: function(func_, args_) {
        var node = this._first;
        do {
            func_.apply(node.data, args_);
            //-- this: node or node.data?
            //-- logical: node.data
            //-- BUT: breaks if node data is value (number, ...)
            node = node.next;
        } while (node != null);
        return this;
    },

    flush: function() {
        while (this._first) this.shift();
    },

    appendArray: function(array_) {
        var len = array_.length,
            i = 0;
        for (; i < len; ++i) this.append(array_[i]);
    },

    prependArray: function(array_) {
        var i = array_.length;
        while (i--) this.prepend(array_[i]);
    },

    toString: function() {
        var rv = [];
        this.map(function() {
            rv.push(this.data);
        });
        return '(' + rv.join(', ') + ')';
    },

    count: function() {
        var node = this._first;
        if (node == null) return 0;
        var rv = 1;
        while ((node = node.next) != null)++rv;
        return rv;
    }

}