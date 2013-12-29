# pingable

Ping a stream once in a while. If the ping times out the stream will be destroyed.

	npm install pingable

## Usage

``` js
var pingable = require('pingable');

pingable(stream, {
	interval: 15000, // how often should we ping it,
	timeout: 5000    // whats the ping timeout?
}, function(cb) {
	// do the ping somehow
	stream.write('ping');

	// when the ping is completed call the cb
	stream.once('data', function() {
		cb();
	});
});

stream.on('close', function() {
	// if the ping fails stream.destroy will be called
	// which usually triggers a close
});
```

If you are streaming some sort of protocol thats supports a ping just do

``` js
pingable(stream, opts, function(cb) {
	stream.ping(cb);
});
```

## License

MIT