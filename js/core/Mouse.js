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
		signals = {},
		handlers = {},
		mouseMoveSignal = new lib.Signal(),
		xOffset = 0,
		yOffset = 0,
		//-- choose event handler depending on the event
		mouseMoveHandler = function(e) {
			if (e.pageX) {
				mouseMoveHandler = function(e) {
					e.preventDefault();
					mouseMoveSignal.dispatch(self.x = e.pageX - xOffset, self.y = e.pageY - yOffset);
				}
			} else if (e.originalEvent.targetTouches[0].pageX) {
				mouseMoveHandler = function(e) {
					e.preventDefault();
					mouseMoveSignal.dispatch(
						self.x = e.originalEvent.targetTouches[0].pageX - xOffset,
						self.y = e.originalEvent.targetTouches[0].pageY - yOffset);
				}
			}
			mouseMoveHandler(e);
		};

	//-- init signals value
	self.x = -1;
	self.y = -1;
	mouseMoveSignal.value = [self.x, self.y];

	// dynamic signals / handlers generation
	function getHandler(as) {
		return function(evt) {
			signals[as].dispatch(self.x, self.y);
		}
	}
	var as = null;
	for (var i = data.length - 1; i > -1; --i) {
		as = data[i].as;
		self[as] = signals[as] = new lib.Signal();
		self[as].value = [self.x, self.y];
		handlers[as] = getHandler(as);
	}

	//...

	function updateOffset() {
		if (!element.getBoundingClientRect) return;
		var rect = element.getBoundingClientRect();
		xOffset = rect.left;
		yOffset = rect.top;
	}

	function bind(val, ctx, evts, handler) {
		var method = val ? ctx.addEventListener : ctx.removeEventListener;
		if (Object.prototype.toString.call(evts) == '[object Array]') {
			var i = evts.length;
			while (i--) method.call(ctx, evts[i], handler);
		} else method.call(ctx, evts, handler);
	}

	//-- Platform specific config
	var mouseMoveEvent = isMobile ? ['touchstart', 'touchmove', 'touchend'] : 'mousemove';

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