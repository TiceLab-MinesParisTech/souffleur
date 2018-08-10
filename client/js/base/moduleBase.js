var ModuleBase = function(terminal) {
	this.terminal = terminal;

	this.toolTerminals = new ToolTerminals(this);
	this.toolAbout = new ToolAbout(this);

	this.init();
};

ModuleBase.prototype.init = function() {
	var self = this;
	
	this.terminal.menubar.addTool("Settings", this.toolTerminals);
	this.terminal.menubar.addTool("About…", this.toolAbout);

	this.terminal.keyboard.on("v", function() { self.kbdToggleToolbar(); });
};

ModuleBase.prototype.kbdToggleToolbar = function() {
	this.terminal.settings.switchParam("toolbarVisibility");
};

