var Terminal = function(ref) {
	this.client = new Client(this);
	this.settings = new Settings(this, ref);
	this.notifier = new Notifier(this);
	this.output = new TerminalOutput(this);
	this.tally = new Tally(this);
	this.menubar = new Menubar(this);
	this.actionbar = new Actionbar(this);
	this.keyboard = new Keyboard(this);	

	this.prompterModule = new PrompterModule(this);
	this.dmxModule = new DmxModule(this);

	this.node = document.createElement("div");
	this.nodeCSS = document.createElement("link");
	
	this.init();
}

Terminal.prototype.init = function() {
	var self = this;
	this.node.className = "terminal";
	
	this.node.appendChild(this.output.node);
	this.node.appendChild(this.actionbar.node);
	this.node.appendChild(this.menubar.node);

	this.node.appendChild(this.notifier.node);
	this.node.appendChild(this.tally.node);

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

Terminal.prototype.emitRecorderStart = function() {
	var fileId = this.menubar.toolFile.getId();
	this.client.emitRecorderStart(fileId ? fileId + "-%src%" : null);
};

Terminal.prototype.emitRecorderStop = function() {
	this.client.emitRecorderStop();
};

Terminal.prototype.setRecorderState = function(value) {
	this.actionbar.toolRecorder.setState(value);
};

Terminal.prototype.setRecorderStatus = function(arr) {
	this.actionbar.toolRecorder.showStatus(arr);
};

Terminal.prototype.applySize = function(value) {
	//this.view.setSize(value);
};

Terminal.prototype.applyName = function(value) {
};

Terminal.prototype.applyFlip = function(value) {
	this.node.className = "terminal" + (value ? " flip" : "");
};

Terminal.prototype.applyToolbarVisibility = function(value) {
	this.menubar.setVisibility(value);
	this.actionbar.setVisibility(value);
};

Terminal.prototype.applyNotifierVisibility = function(value) {
	this.notifier.setVisibility(value);
}
Terminal.prototype.applyDefaultTrack = function(value) {
	this.prompterModule.toolTracksList.set(value);
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
	this.menubar.toolTerminals.showParam(socketid, key, value);
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

Terminal.prototype.load = function() {
	this.prompterModule.load();
};

Terminal.prototype.onresize = function() {
	this.client.emitClientSet();
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
	this.node.style.top = "60px";
	this.node.style.left = "10px";
	this.node.style.width = width + "px";
	this.node.style.height = height + "px";
};

TerminalOutput.prototype.setContent = function(node) {
	while (this.nodeContent.firstChild) this.nodeContent.removeChild(this.nodeContent.firstChild);
	this.nodeContent.appendChild(node);
};
