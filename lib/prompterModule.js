var PrompterModule = function(server) {
	this.server = server;
	this.tracks = null;
};

PrompterModule.prototype.bindEvents = function(socket) {
	var self = this;
	socket.on('speed::set', function(speed) {
		console.log("speed::set", speed);
		self.server.io.emit('speed::set', speed);
	});

	socket.on('tracks::load', function(tracks) {
		console.log("tracks::load", JSON.stringify(tracks));
		self.server.io.emit('tracks::load', tracks);
		self.tracks = tracks;
	});

	socket.on('play', function(args) {
		console.log("play", args.position + ", " + args.speed);
		self.server.io.emit('play', args);
	});

	socket.on('stop', function(position) {
		console.log("stop", JSON.stringify(position));
		self.server.io.emit('stop', position);
	});

	//socket.on("connection", function() {
		if (self.tracks) socket.emit("tracks::load", self.tracks);
	//});
};

//PrompterModule.prototype.connect = function(socket) {
//	if (self.tracks) socket.emit("tracks::load", self.tracks);
//};

module.exports = PrompterModule;
