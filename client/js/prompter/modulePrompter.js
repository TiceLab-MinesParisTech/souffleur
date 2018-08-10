var ModulePrompter = function(terminal) {
	this.terminal = terminal;
	this.player = new Player(this);	
	this.view = new ViewEmpty(this);
	this.output = new PrompterOutput(this);

	this.actionStartStop = new ActionStartStop(this);
	this.actionSpeed = new ActionSpeed(this);
	this.actionJump = new ActionJump(this);
	
	this.toolTracksList = new ToolTracksList(this);
	this.toolFile = new ToolFile(this);

	this.init();
};

ModulePrompter.prototype.init = function() {
	var self = this;
	
	this.terminal.actionbar.addAction(this.actionStartStop);
	this.terminal.actionbar.addAction(this.actionSpeed);
	this.terminal.actionbar.addAction(this.actionJump);

	this.terminal.background.add(this.output, "prompter");
	this.terminal.menubar.addTool("File", this.toolFile);

	this.terminal.keyboard.on("Space", function() { self.kbdPlayStop(); });
	this.terminal.keyboard.on("ArrowUp", function() { self.kbdPrevious(); });
	this.terminal.keyboard.on("ArrowDown", function() { self.kbdNext(); });
	this.terminal.keyboard.on("ArrowRight", function() { self.kbdIncSpeed(); });
	this.terminal.keyboard.on("ArrowLeft", function() { self.kbdDecSpeed(); });
	this.terminal.keyboard.on("+", function() { self.kbdIncSpeed(); });
	this.terminal.keyboard.on("-", function() { self.kbdDecSpeed(); });
	this.terminal.keyboard.on("PageUp", function() { self.kbdDec(); });
	this.terminal.keyboard.on("PageDown", function() { self.kbdInc(); });
	
	this.on("play", function(args) { self.onPlay(args); })
	this.on("stop", function(args) { self.onStop(args); })
	this.on("tracks::load", function(args) { self.onLoadTracks(args); })
	this.on("speed::set", function(args) { self.onSetSpeed(args); })

	this.output.setContent(this.view.node);
};


ModulePrompter.prototype.emit = function(cmd, args) {
	this.terminal.client.emit(cmd, args);
};

ModulePrompter.prototype.on = function(name, cb) {
	this.terminal.client.socket.on(name, cb);
};

ModulePrompter.prototype.emitPlaySpeed = function(position, speed) {
	this.emit('play', {"position": position, "speed": speed});
};

ModulePrompter.prototype.emitPlay = function(position) {
	if (position == null) position = this.view.getPosition(); 
	this.emitPlaySpeed(position, this.actionSpeed.getSpeed());
};

ModulePrompter.prototype.play = function(position, speed) {
	this.actionStartStop.setValue(true);
	this.player.play(position, speed);
};

ModulePrompter.prototype.onPlay = function(args) {
	this.play(args.position, args.speed);
};

ModulePrompter.prototype.stop = function(position) {
	this.player.stop(position);
	this.actionStartStop.setValue(false);
};

ModulePrompter.prototype.onStop = function(position) {
	this.stop(position);
};

ModulePrompter.prototype.emitStop = function(position) {
	this.emit('stop', position);
};

ModulePrompter.prototype.loadCurrentTracks = function(fct) {
	this.terminal.client.loadJSON("tracks", fct);
};

ModulePrompter.prototype.load = function() {
	var self = this;
	this.loadCurrentTracks(function(tracks) {
		if (tracks) self.loadTracks(tracks) 
	});
};

ModulePrompter.prototype.setView = function(view) {
	if (!view) view = new ViewEmpty(this);
	this.output.setContent(view.node);
	this.view = view;
};

ModulePrompter.prototype.loadTrack = function(track) {
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

ModulePrompter.prototype.emitLoadTracks = function(tracks) {
	this.emit('tracks::load', tracks);
};

ModulePrompter.prototype.loadTracks = function(arr) {
	this.setView(null);
	this.toolFile.setId("id" in arr.meta ? arr.meta.id : null);
	this.toolFile.setFilename(arr.filename);
	this.toolTracksList.setTracks(arr.tracks);
	this.terminal.applyDefaultTrack(this.terminal.settings.getParam("defaultTrack"));
	this.stop(0);
};

ModulePrompter.prototype.onLoadTracks = function(tracks) {
	this.loadTracks(tracks);
};

ModulePrompter.prototype.emitSetSpeed = function(value) {
	this.emit('speed::set', value);
	if (this.player.isPlaying()) this.emitPlaySpeed(this.player.getPosition(), value);
};

ModulePrompter.prototype.onSetSpeed = function(value) {
	this.actionSpeed.setSpeed(value);
};

ModulePrompter.prototype.kbdPlayStop = function() {
	this.actionStartStop.emitPlayStop();
};

ModulePrompter.prototype.kbdNext = function() {
	this.view.next();
};

ModulePrompter.prototype.kbdPrevious = function() {
	this.view.previous();
};

ModulePrompter.prototype.kbdIncSpeed = function() {
	this.actionSpeed.emitIncSpeed(0.1);
};

ModulePrompter.prototype.kbdDecSpeed = function() {
	this.actionSpeed.emitIncSpeed(-0.1);
};

ModulePrompter.prototype.kbdInc = function() {
	if (this.player.isPlaying())
		this.kbdIncSpeed();
	else
		this.kbdNext();
};

ModulePrompter.prototype.kbdDec = function() {
	if (this.player.isPlaying())
		this.kbdDecSpeed();
	else
		this.kbdPrevious();
};
