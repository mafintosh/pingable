var ping = function(stream, opts, fn) { // TODO: move to module
	if (typeof opts === 'function') return ping(stream, null, opts);
	if (!opts) opts = {};

	if (!fn) {
		fn = function(cb) {
			stream.ping(cb);
		};
	}

	var id;
	var interval = opts.interval || 15000;
	var timeout = opts.timeout || 5000;

	var destroy = function() {
		clearTimeout(id);
		stream.destroy();
	};

	var onpong = function(err) {
		clearTimeout(id);
		if (!err) id = setTimeout(loop, interval);
	};

	var loop = function() {
		id = setTimeout(destroy, timeout);
		fn(onpong);
	};

	id = setTimeout(loop, interval);
	return function() {
		clearTimeout(id);
	};
};

module.exports = ping;