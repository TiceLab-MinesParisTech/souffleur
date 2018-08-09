var ModuleBase = function(terminal) {
	this.terminal = terminal;

	this.toolTerminals = new ToolTerminals(this.terminal);
	this.toolAbout = new ToolAbout(this.terminal);

	this.init();
};

ModuleBase.prototype.init = function() {
	this.terminal.menubar.addTool("Settings", this.toolTerminals);
	this.terminal.menubar.addTool("About", this.toolAbout);
};
