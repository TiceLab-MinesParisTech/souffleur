var Terminal = function(server, ref) {
	this.server = server;

	this.settings = new Settings(this, ref);
	this.notifier = new Notifier(this);
	this.output = new TerminalOutput(this);
	this.view = new ViewEmpty(this);
	this.tally = new Tally(this);
	this.toolbar = new Toolbar(this);
	this.actionbar = new Actionbar(this);
	this.player = new Player(this);	
	this.keyboard = new Keyboard(this);	

	this.node = document.createElement("div");
	this.nodeCSS = document.createElement("link");
	
	this.init();
}

Terminal.prototype.init = function() {
	var self = this;
	this.node.className = "terminal";
	
	this.node.appendChild(this.output.node);
	this.node.appendChild(this.toolbar.node);
	this.node.appendChild(this.actionbar.node);
	this.output.setContent(this.view.node);
	this.node.appendChild(this.notifier.node);
	this.node.appendChild(this.tally.node);

	this.server.attachTerminal(this);	
	this.settings.applyParams();

	this.nodeCSS.setAttribute("rel", "stylesheet");
	this.nodeCSS.setAttribute("type", "text/css");
	
	window.onresize = function(e) { self.onresize(e) };
	this.notifier.setEnabled(true);
}

Terminal.prototype.setCSS = function(href) {
	if (!href) {
		if (this.nodeCSS.parentNode == document.head) document.head.removeChild(this.nodeCSS);
		return;
	}
	this.nodeCSS.setAttribute("href", href)
	document.head.appendChild(this.nodeCSS);
};

Terminal.prototype.setSettings = function(arr) {
	this.settings.set(arr);
}

Terminal.prototype.setView = function(view) {
	if (!view) view = new ViewEmpty(this);
	this.output.setContent(view.node);
	this.view = view;
};

Terminal.prototype.play = function(position, speed) {
	this.player.play(position, speed);
	this.actionbar.toolStartStop.setValue(true);

	this.toolbar.toolRecorder.setPlaying(true);
};

Terminal.prototype.stop = function(position) {
	this.player.stop(position);
	this.Actionbar.toolStartStop.setValue(false);
	this.toolbar.toolRecorder.setPlaying(false);
};

Terminal.prototype.load = function() {
	var self = this;
	this.server.loadCurrentTracks(function(tracks) {
		if (tracks) self.loadTracks(tracks) 
	});
};

Terminal.prototype.loadTrack = function(track) {
	var mapping = {
		"scroll": ViewScroll,
		"slider": ViewSlider
	};
	var Class = track.type in mapping ? mapping[track.type] : ViewEmpty;
	var view = new Class(this);
	this.setView(view);
	this.settings.applyParam("size");
	this.settings.applyParam("flip");
	this.view.load(track.parts);
	this.view.setPosition(this.player.getPosition());
};

Terminal.prototype.loadTracks = function(arr) {
	this.setView(null);
	this.toolbar.toolFile.setId("id" in arr.meta ? arr.meta.id : null);
	this.toolbar.toolFile.setFilename(arr.filename);
	this.toolbar.toolTracksList.setTracks(arr.tracks);
	this.applyDefaultTrack(this.settings.getParam("defaultTrack"));
	this.stop(0);
};

Terminal.prototype.emitPlay = function(position) {
	if (position == null) position = this.view.getPosition(); 
	this.server.emitPlay(position, this.toolbar.toolSpeed.getSpeed());
};

Terminal.prototype.emitStop = function(position) {
	this.server.emitStop(position);
};

Terminal.prototype.emitRecorderStart = function() {
	var fileId = this.toolbar.toolFile.getId();
	this.server.emitRecorderStart(fileId ? fileId + "-%src%" : null);
};

Terminal.prototype.emitRecorderStop = function() {
	this.server.emitRecorderStop();
};

Terminal.prototype.setRecorderState = function(value) {
	this.toolbar.toolRecorder.setState(value);
};

Terminal.prototype.setRecorderStatus = function(arr) {
	this.toolbar.toolRecorder.showStatus(arr);
};

Terminal.prototype.emitSetSpeed = function(value) {
	this.server.emitSetSpeed(value);
	if (this.player.isPlaying()) this.server.emitPlay(this.player.getPosition(), value);
};

Terminal.prototype.applySize = function(value) {
	this.view.setSize(value);
};

Terminal.prototype.applyName = function(value) {
};

Terminal.prototype.applyFlip = function(value) {
	this.node.className = "terminal" + (value ? " flip" : "");
};

Terminal.prototype.applyToolbarVisibility = function(value) {
	this.toolbar.setVisibility(value);
	this.actionbar.setVisibility(value);
};

Terminal.prototype.applyNotifierVisibility = function(value) {
	this.notifier.setVisibility(value);
}
Terminal.prototype.applyDefaultTrack = function(value) {
	this.toolbar.toolTracksList.set(value);
};

Terminal.prototype.applyColors = function(value) {
	this.setCSS(value != "" ? "css/colors_" + value + ".css" : false);
};

Terminal.prototype.applyMask = function(value) {
	this.output.mask.set(value);
};

Terminal.prototype.setSettingsParam = function(socketid, key, value) {
	if (!socketid) {
		this.settings.saveParam(key, value);
		this.settings.notifyParam(key, value);
	}
	this.toolbar.toolTerminals.showParam(socketid, key, value);
};

Terminal.prototype.id = function() {
	this.notifier.show(Settings.params.name.render(this.settings.getParam("name")), true);
};

Terminal.prototype.getSize = function() {
	return {
		"width": window.innerWidth,
		"height": window.innerHeight
	};
};

Terminal.prototype.getData = function() {
	return {
		"type": "terminal",
		"size": this.getSize(),
		"settings": this.settings.get()
	};
};

Terminal.prototype.onresize = function() {
	this.server.emitClientSet();
};

var TerminalOutput = function(terminal) {
	this.terminal = terminal;
	
	this.node = document.createElement("div");
	this.node.className = "terminalOutput";

	this.nodeContent = document.createElement("div");
	this.nodeContent.className = "content";

	this.mask = new Mask();
	this.node.appendChild(this.mask.node);

	this.node.appendChild(this.nodeContent);
};

TerminalOutput.prototype.resetSize = function() {
	this.node.style.top = "";
	this.node.style.left = "";
	this.node.style.width = "";
	this.node.style.height = "";
};

TerminalOutput.prototype.setSize = function(width, height) {
	this.node.style.top = "90px";
	this.node.style.left = "20px";
	this.node.style.width = width + "px";
	this.node.style.height = height + "px";
};

TerminalOutput.prototype.setContent = function(node) {
	while (this.nodeContent.firstChild) this.nodeContent.removeChild(this.nodeContent.firstChild);
	this.nodeContent.appendChild(node);
};
