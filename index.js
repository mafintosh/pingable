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
	var pinging = true;

	var unping = function() {
		pinging = false;
		clearTimeout(id);
	};

	var destroy = function() {
		unping();
		stream.destroy();
	};

	var onpong = function(err) {
		clearTimeout(id);
		if (!err && pinging) id = setTimeout(loop, interval);
	};

	var loop = function() {
		id = setTimeout(destroy, timeout);
		fn(onpong);
	};

	id = setTimeout(loop, interval);

	return unping;
};

module.exports = ping;