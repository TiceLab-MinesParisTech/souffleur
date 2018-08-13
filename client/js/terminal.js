var Terminal = function(ref) {
	this.client = new Client(this);
	this.settings = new Settings(this, ref);
	this.notifier = new Notifier(this);
	this.menubar = new Menubar(this);
	this.actionbar = new Actionbar(this);
	this.keyboard = new Keyboard(this);	
	this.background = new TerminalBackground(this);
	this.foreground = new TerminalForeground(this);

	this.node = document.createElement("div");
	this.nodeCSS = document.createElement("link");

	//modules
	this.modulePrompter = new ModulePrompter(this);
	this.moduleRecorders = new ModuleRecorders(this);
	this.moduleDmx = new ModuleDmx(this);
	this.moduleBase = new ModuleBase(this);
	
	this.init();
}

Terminal.prototype.init = function() {
	var self = this;
	this.node.className = "terminal";
	
	this.node.appendChild(this.background.node);
	this.node.appendChild(this.actionbar.node);
	this.node.appendChild(this.menubar.node);
	this.node.appendChild(this.foreground.node);

	this.foreground.add(this.notifier);

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


Terminal.prototype.setFlip = function(value) {
	this.node.className = "terminal" + (value ? " flip" : "");
};

Terminal.prototype.setColors = function(value) {
	this.setCSS(value != "" ? "css/colors_" + value + ".css" : false);
};

Terminal.prototype.setSettingsParam = function(socketid, key, value) {
	if (!socketid) {
		this.settings.saveParam(key, value);
		this.settings.notifyParam(key, value);
	}
	this.moduleBase.toolTerminals.showParam(socketid, key, value);
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
	this.client.emitClientSet();
};

var TerminalBackground = function() {
	this.node = document.createElement("div");
};

TerminalBackground.prototype.add = function(widget, title) {
	this.node.appendChild(widget.node);
};

var TerminalForeground = function() {
	this.node = document.createElement("div");
};

TerminalForeground.prototype.add = function(widget) {
	this.node.appendChild(widget.node);
};

