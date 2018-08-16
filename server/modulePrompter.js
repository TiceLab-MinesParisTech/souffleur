var Player = function() {
	this.date = null;
	this.speed = 1;
	this.position = 0;
};

Player.prototype.isPlaying = function() {
	return this.date != null;
};

Player.prototype.getPositionFromDate = function(date) {
	return this.position + Math.abs(date - this.date) * this.speed;
};

Player.prototype.getPosition = function() {
	return this.isPlaying() ? this.getPositionFromDate(new Date()) : this.position;
};

Player.prototype.play = function(position, speed) {
	this.date = new Date();
	this.position = position;
	this.speed = speed;
};

Player.prototype.stop = function(position) {
	this.position = position ? position : this.getPosition();
	this.date = null;
};

var ModulePrompter = function(server) {
	this.server = server;
	this.tracks = null;
	this.player = new Player();
	this.init();
};

ModulePrompter.prototype.init = function() {
	var self = this;
	this.server.keyboard.on("KEYDOWN", function(e) { self.onKeypress(e); } )
	this.server.keyboard.on("KEYPRESS", function(e) { self.onKeypress(e); } )
};

ModulePrompter.prototype.bind = function(socket) {
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

	if (this.tracks) {
		console.log("tracks.load");
		socket.emit("tracks::load", this.tracks);
		if (this.player.isPlaying())
			socket.emit("play", {"position": this.player.getPosition(), "speed": this.player.speed});
		else		
			socket.emit("stop", this.player.getPosition());
	}
};

ModulePrompter.prototype.play = function(position, speed) {
	console.log("play", position, speed);
	position = Math.round(position);
	speed = Math.round(speed * 100) / 100;
	this.server.io.emit('play', {"position": position, "speed": speed});
	this.player.play(position, speed);
	this.speed = speed;
};

ModulePrompter.prototype.stop = function(position) {
	console.log("stop", position);
	position = position ? Math.round(position) : this.player.getPosition();
	this.server.io.emit('stop', position);
	this.player.stop(position);
};

ModulePrompter.prototype.setSpeed = function(value) {
	value = Math.round(value * 100) / 100;
	console.log("speed::set", value);
	this.server.io.emit('speed::set', value);
	this.player.speed = value;
};

ModulePrompter.prototype.onKeypress = function(event) {
	switch (event.code) {
		case "KEY_DOT":
			this.kbdPlayStop(event);
			break;
		case "KEY_PAGEUP":
			this.kbdDec(event);
			break;
		case "KEY_PAGEDOWN":
			this.kbdInc(event);
			break;
	}
};

ModulePrompter.prototype.kbdSetSpeed = function(value) {
	if (this.player.isPlaying()) {
		this.play(this.player.getPosition(), value);
	}
	this.setSpeed(value);
};

ModulePrompter.prototype.kbdIncSpeed = function(value) {
	this.kbdSetSpeed(this.player.speed + value);
};

ModulePrompter.prototype.kbdSetPosition = function(value) {
	this.stop(value > 1 ? value : 1);
};

ModulePrompter.prototype.kbdIncPosition = function(value) {
	this.kbdSetPosition(this.player.getPosition() + value);
};

ModulePrompter.prototype.kbdPlayStop = function() {
	if (this.player.isPlaying()) 
		this.stop(this.player.getPosition());
	else
		this.play(this.player.getPosition(), this.player.speed);
};

ModulePrompter.prototype.kbdInc = function(event) {
	console.log(event.code);
	if (this.player.isPlaying())
		this.kbdIncSpeed(+0.1);
	else
		this.kbdIncPosition(event.code == "PAGEDOWN" ? 5000 : 1000);
};

ModulePrompter.prototype.kbdDec = function(event) {
	if (this.player.isPlaying())
		this.kbdIncSpeed(-0.1);
	else
		this.kbdIncPosition(event.code == "PAGEDOWN" ? -5000 : -1000);
};

module.exports = ModulePrompter;
