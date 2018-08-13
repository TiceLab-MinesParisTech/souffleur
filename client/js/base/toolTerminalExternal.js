var ToolTerminalExternal = function(module, key, data) {
	this.module = module;
	this.key = key;
	this.node = document.createElement("div");

	this.settings = new SettingsExternal(module.terminal, key, data.settings);
	this.toolSettings = new ToolSettings(this.settings);
	this.toolUtils = new ToolTerminalExternalUtils(this.module, data.size, key);

	this.init();
}

ToolTerminalExternal.prototype.init = function() {
	this.node.className = "toolTerminal external";
	this.node.appendChild(this.toolSettings.node);
	this.node.appendChild(this.toolUtils.node);
};
