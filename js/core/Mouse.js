lib.Mouse = function(isMobile, element) {

	// mouse move is a special case,
	// other signals can be generated dynamically

	var self = {},
		data = [{
			evt: isMobile ? 'touchstart' : 'mousedown',
			as: 'down'
		}, {
			evt: isMobile ? 'touchend' : 'mouseup',
			as: 'up'
		}, {
			evt: 'click',
			as: 'click'
		}],
		position = {
			x: 0,
			y: 0
		},
		signals = {},
		handlers = {},
		mouseMoveSignal = new lib.Signal(),
		xOffset = 0,
		yOffset = 0;

	//-- init signals value
	mouseMoveSignal.value = position;

	// dynamic signals / handlers generation
	function getHandler(as) {
		return function(evt) {
			signals[as].dispatch(position);
		}
	}
	var as = null;
	for (var i = data.length - 1; i > -1; --i) {
		as = data[i].as;
		self[as] = signals[as] = new lib.Signal();
		self[as].value = position;
		handlers[as] = getHandler(as);
	}

	//...

	function updateOffset() {
		if (!element.getBoundingClientRect) return;
		var rect = element.getBoundingClientRect();
		xOffset = rect.left;
		yOffset = rect.top;
	}

	//-- Event handlers

	function mouseMoveHandlerRegular(e) {
		e.preventDefault();
		position = {
			x: e.pageX - xOffset,
			y: e.pageY - yOffset
		};
		mouseMoveSignal.dispatch(position);
	}

	function mouseMoveHandlerIPad(e) {
		e.preventDefault();
		position = {
			x: e.originalEvent.targetTouches[0].pageX - xOffset,
			y: e.originalEvent.targetTouches[0].pageY - yOffset
		};
		mouseMoveSignal.dispatch(position);
	}

	function bind(val, ctx, evts, handler) {
		var method = val ? ctx.addEventListener : ctx.removeEventListener;
		if (Object.prototype.toString.call(evts) == '[object Array]') {
			var i = evts.length;
			while (i--) method.call(ctx, evts[i], handler);
		} else method.call(ctx, evts, handler);
	}

	//-- Platform specific config
	var mouseMoveHandler = isMobile ? mouseMoveHandlerMobile : mouseMoveHandlerRegular,
		mouseMoveEvent = isMobile ? ['touchstart', 'touchmove', 'touchend'] : 'mousemove';

	//-- Exposed
	self.enabled = function(val) {
		bind(val, element, mouseMoveEvent, mouseMoveHandler)
		for (var i = data.length - 1; i > -1; --i) {
			bind(val, element, data[i].evt, handlers[data[i].as])
		}
		if (val) updateOffset();
	}

	self.position = mouseMoveSignal;

	return self;
}