var PrompterModule = function(server) {
	this.server = server;
	this.tracks = null;
	this.playing = false;
};

PrompterModule.prototype.bindEvents = function(socket) {
	var self = this;
	
	socket.on('speed::set', function(speed) {
		self.setSpeed(speed);
	});

	socket.on('tracks::load', function(tracks) {
		console.log("tracks::load", JSON.stringify(tracks));
		self.server.io.emit('tracks::load', tracks);
		self.tracks = tracks;
	});

	socket.on('play', function(args) {
		self.play(args.position, args.speed);
	});

	socket.on('stop', function(position) {
		self.stop(position);
	});

	if (self.tracks) socket.emit("tracks::load", self.tracks);
};

PrompterModule.prototype.play = function(position, speed) {
	console.log("play", position, speed);
	this.server.io.emit('play', {"position": position, "speed": speed});
	this.playing = true;
};

PrompterModule.prototype.stop = function(position) {
	console.log("stop", position);
	this.server.io.emit('stop', position);
	this.playing = false;
};

PrompterModule.prototype.setSpeed = function(value) {
	console.log("speed::set", value);
	this.server.io.emit('speed::set', value);
};

module.exports = PrompterModule;
