var PrompterModule = function(terminal) {
	this.terminal = terminal;
	this.player = new Player(this);	
	this.view = new ViewEmpty(this);

	this.actionStartStop = new ActionStartStop(this);
	this.actionSpeed = new ActionSpeed(this);
	this.actionJump = new ActionJump(this);

	this.init();
};

PrompterModule.prototype.init = function() {
	var self = this;
	
	this.terminal.actionbar.addAction(this.actionStartStop);
	this.terminal.actionbar.addAction(this.actionSpeed);
	this.terminal.actionbar.addAction(this.actionJump);

	this.terminal.output.setContent(this.view.node);

	this.on("play", function(args) { self.onPlay(args); })
	this.on("stop", function(args) { self.onStop(args); })
	this.on("tracks::load", function(args) { self.onLoadTracks(args); })
	this.on("speed::set", function(args) { self.onSetSpeed(args); })
};

PrompterModule.prototype.emit = function(cmd, args) {
	this.terminal.client.emit(cmd, args);
};

PrompterModule.prototype.on = function(name, cb) {
	this.terminal.client.socket.on(name, cb);
};

PrompterModule.prototype.emitPlay = function(position, speed) {
	this.emit('play', {"position": position, "speed": speed});
};

PrompterModule.prototype.play = function(position) {
	if (position == null) position = this.view.getPosition(); 
	this.emitPlay(position, 1);
};

PrompterModule.prototype.onPlay = function(args) {
	this.actionStartStop.setValue(true);
};

PrompterModule.prototype.stop = function(position) {
	this.player.stop(position);
	this.actionStartStop.setValue(false);
};

PrompterModule.prototype.onStop = function(args) {
	this.stop();
};

PrompterModule.prototype.emitStop = function(position) {
	this.emit('stop', position);
};

PrompterModule.prototype.loadCurrentTracks = function(fct) {
	this.terminal.client.loadJSON("tracks", fct);
};

PrompterModule.prototype.load = function() {
	var self = this;
	this.loadCurrentTracks(function(tracks) {
		if (tracks) self.loadTracks(tracks) 
	});
};

PrompterModule.prototype.setView = function(view) {
	if (!view) view = new ViewEmpty(this);
	this.terminal.output.setContent(view.node);
	this.view = view;
};

PrompterModule.prototype.loadTrack = function(track) {
	var mapping = {
		"scroll": ViewScroll,
		"slider": ViewSlider
	};
	var Class = track.type in mapping ? mapping[track.type] : ViewEmpty;
	var view = new Class(this);
	this.setView(view);
	this.terminal.settings.applyParam("size");
	this.terminal.settings.applyParam("flip");
	this.view.load(track.parts);
	this.view.setPosition(this.player.getPosition());
};

PrompterModule.prototype.emitLoadTracks = function(tracks) {
	this.emit('tracks::load', tracks);
};

PrompterModule.prototype.loadTracks = function(arr) {
	this.setView(null);
//	this.menubar.toolFile.setId("id" in arr.meta ? arr.meta.id : null);
//	this.menubar.toolFile.setFilename(arr.filename);
//	this.menubar.toolTracksList.setTracks(arr.tracks);
	this.terminal.applyDefaultTrack(this.terminal.settings.getParam("defaultTrack"));
	this.stop(0);
};

PrompterModule.prototype.onLoadTracks = function(tracks) {
	this.loadTracks(tracks);
};

PrompterModule.prototype.emitSetSpeed = function(value) {
	this.emit('speed::set', value);
};

PrompterModule.prototype.onSetSpeed = function(value) {
	this.actionSpeed.setSpeed(value);
};


