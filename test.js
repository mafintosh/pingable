var pingable = require('./index');
var assert = require('assert');
var stream = require('stream');

var s = new stream.Duplex();

s._write = s._read = function() {

};

s.destroy = function() {
	assert(true);
	process.exit(0);
};

pingable(s, {interval:500, timeout:100}, function(cb) {
	s.write('test', cb);
});

setTimeout(function() {
	throw new Error('timeout!');
}, 5000);