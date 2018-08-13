var ToolTerminalExternalUtils = function(module, size, key) {
	this.node = document.createElement("nav");
	this.module = module;

	this.size = size;
	this.key = key;

	this.init();
};

ToolTerminalExternalUtils.prototype.init = function() {
	var self = this;

	this.node.className = "toolTerminalExternalUtils";

	var div = document.createElement("div");
	div.className = "resolution";
	this.node.appendChild(div);

	div.appendChild(document.createTextNode(this.size.width + "×" + this.size.height));
	div.onclick = function() { self.resize() };

	var div = document.createElement("div");
	div.className = "id";
	div.onclick = function() { self.id(); return false; };
	this.node.appendChild(div);
};

ToolTerminalExternalUtils.prototype.id = function() {
	this.module.terminal.client.emitId(this.key);
};

ToolTerminalExternalUtils.prototype.resize = function() {
	this.module.terminal.modulePrompter.output.setSize(this.size.width, this.size.height);
};

