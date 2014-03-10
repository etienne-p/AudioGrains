var Async = function(func_, arg_) {

    var _callbacks = [],
        _cArgs,
        _self = {};

    function _onSuccess(args_) {
        console.log('_onSuccess, args_: [' + args_ + ']');
        if (_callbacks.length > 0)
            _callbacks.shift().success.apply(null, args_ ? _cArgs.concat(args_) : _cArgs);
    }

    function _onError(args_) {
        console.log('_onError, args_: [' + args_ + ']');
        if (_callbacks.length > 0)
            _callbacks.shift().fail.apply(null, args_);
    }

    _self.then = function(success_, fail_, args_) {
        _callbacks.push({
            success: success_,
            fail: fail_
        });
        return _self;
    }

    _cArgs = [_onSuccess, _onError]

    func_.apply(null, arg_ ? _cArgs.concat(arg_) : _cArgs);

    return _self;
}

var Parallel = function(funcs_, ok_, ko_) {

    var _count = funcs_.length, i = _count;

    function okProxy() {
        if (--_count < 1) ok_.call();
    }

    while (i--) funcs_[i].call(null, okProxy, ko_)

}