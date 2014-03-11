lib.MetaUtil = {

	//-- adds an accessor to a prototype object
	//-- prototype: the prototype receiving the method
	//-- type: a type to test for before setting the value
	//-- name: name of the accessor
	//-- value: value to set on the object, if undefined, 
	//-- we assume that it is '__' + [name]
	accessor: function(Obj, type, name, value) {
		value = (typeof value !== 'string') ? '__' + name : value;
		var fBody = [
			'	if (typeof arg === \'' + type + '\') {',
			'		this.' + value + ' = arg;',
			'	}',
			'	return this.' + value + ';'
		];
		Obj.prototype[name] = new Function('arg', fBody.join(''));
	},

	mixin: function(ctx, obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				if (!ctx.hasOwnProperty(prop)) {
					ctx[prop] = obj[prop];
				} else throw 'mixin failed, property [' + prop + '] already exists on target';
			}
		}
	}
}