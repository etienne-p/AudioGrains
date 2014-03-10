lib.ArrayUtil = {

	each: function(arr, func, args) {
		var i = arr.length;
		while (--i) func.apply(arr[i], args);
	},

	clone: function(arr) {
		return arr.slice(0);
	},

	remove: function(arr, item) {
		var removedItem = false;
		for (var i = arr.length; i--;) {
			if (arr[i] === item) {
				arr.splice(i, 1);
				removedItem = true;
			}
		}
		return removedItem;
	},

	shuffle: function(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}
}