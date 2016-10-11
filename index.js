var eos = require('end-of-stream');

var ping = function(stream, opts, fn) {
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
		if (err || !pinging) return;
		id = setTimeout(loop, interval);
		id.unref();
	};

	var loop = function() {
		id = setTimeout(destroy, timeout);
		fn(onpong);
	};

	id = setTimeout(loop, interval);
	if (id.unref) id.unref();

	eos(stream, unping);

	return unping;
};

module.exports = ping;
