var PrompterModule = function(server) {
	this.server = server;
	this.tracks = null;
};

PrompterModule.prototype.bindEvents = function(events) {
	var self = this;
	events.on('speed::set', function(speed) {
		console.log("speed::set", speed);
		self.server.io.emit('speed::set', speed);
	});

	events.on('tracks::load', function(tracks) {
		console.log("tracks::load", JSON.stringify(tracks));
		self.server.io.emit('tracks::load', tracks);
		self.tracks = tracks;
	});

	events.on('play', function(args) {
		console.log("play", args.position + ", " + args.speed);
		self.server.io.emit('play', args);
	});

	events.on('stop', function(position) {
		console.log("stop", JSON.stringify(position));
		self.server.io.emit('stop', position);
	});
};

module.exports = PrompterModule;
