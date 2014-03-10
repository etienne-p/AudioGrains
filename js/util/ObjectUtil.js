lib.ObjectUtil = {

	addProps: function(from, to) {
		for (var prop in from) {
			if (from.hasOwnProperty(prop) === true && to.hasOwnProperty(prop) == false) {
				to[prop] = from[prop];
			}
		}
	},

	clone: function(obj) {
		var rv = {};
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop) === true) {
				rv[prop] = obj[prop];
			}
		}
		return rv;
	},

	merge: function(objs) {
		var rv = {},
			i = objs.length,
			obj,
			prop;

		while (i--) {
			obj = objs[i];
			for (var prop in obj) {
				if ((rv.hasOwnProperty(prop) === false) && (obj.hasOwnProperty(prop) === true)) {
					rv[prop] = obj[prop];
				}
			}
		}
		return rv;
	},

	describe: function(obj) {
		console.log('Description of: [' + obj + ']');
		for (var prop in obj) {
			console.log('-> ' + prop + ':' + (typeof obj[prop]) + ' = ' + obj[prop].toString().substr(0, 40));
		}
	}
}