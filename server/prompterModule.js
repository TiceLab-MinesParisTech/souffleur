var PrompterModule = function(server) {
	this.server = server;
	this.tracks = null;
	this.playing = false;
	this.speed = 1;
	this.init();
};

PrompterModule.prototype.init = function() {
	var self = this;
	this.server.keyboard.on("KEYPRESS", function(e) { self.onKeypress(e); } )
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
	value = Math.round(value * 100) / 100;
	console.log("speed::set", value);
	this.server.io.emit('speed::set', value);
	this.speed = value;
};

PrompterModule.prototype.onKeypress = function(event) {
	switch (event.code) {
		case "KEY_DOT":
			this.kbdPlayStop();
			break;
		case "KEY_PAGEUP":
			this.kbdDec();
			break;
		case "KEY_PAGEDOWN":
			this.kbdInc();
			break;
	}
};

PrompterModule.prototype.kbdPlayStop = function() {
	if (this.playing) 
		this.stop();
	else
		this.play(0, this.speed);	
};

PrompterModule.prototype.kbdInc = function() {
	if (this.playing) {
		this.setSpeed(this.speed + 0.1);
	}
};

PrompterModule.prototype.kbdDec = function() {
	if (this.playing) {
		this.setSpeed(this.speed - 0.1);
	}
};

module.exports = PrompterModule;
