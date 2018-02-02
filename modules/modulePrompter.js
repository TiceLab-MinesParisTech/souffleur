var ModulePrompter = function(server) {
	this.server = server;
	this.eventNames = [];
	this.init();
};

ModulePrompter.prototype.emit = function(eventName, args) {
	this.server.io.emit(eventName, args);
};

ModulePrompter.prototype.init = function() {
	var self = this;
	this.on('speed::set', function(speed) {
		console.log("speed::set", speed);
		self.emit('speed::set', speed);
	});

	this.on('tracks::load', function(tracks) {
		console.log("tracks::load", JSON.stringify(tracks));
		self.emit('tracks::load', tracks);
		self.tracks = tracks;
	});

	this.on('play', function(args) {
		console.log("play", args.position + ", " + args.speed);
		self.emit('play', args);
	});

	this.on('stop', function(position) {
		console.log("stop", JSON.stringify(position));
		self.emit('stop', position);
	});
};

ModulePrompter.prototype.on = function(eventName, fct) {
	this.server.on(eventName, fct);
	this.eventNames.push(eventName);
};

ModulePrompter.prototype.bindEvent = function(from, to, eventName) {
	from.on(eventName, function(args) {
		to.emit(eventName, args);
	});
};

ModulePrompter.prototype.bindEvents = function(from, to) {
	for (var i = 0; i < this.eventNames.length; i++) {
		var eventName = this.eventNames[i];
		this.bindEvent(from, to, eventName);
	};
};

module.exports = ModulePrompter;
