var ToolTerminalLocal = function(module) {
	this.module = module;
	this.key = null;

	this.toolSettings = new ToolSettings(this.module.terminal.settings);

	this.node = document.createElement("div");
	this.init();
};

ToolTerminalLocal.prototype.init = function() {
	var self = this;
	
	this.node.className = "toolTerminal";

	this.node.appendChild(this.toolSettings.node);
};


