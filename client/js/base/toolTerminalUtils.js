var ToolTerminalUtils = function() {
	this.node = document.createElement("nav");
	this.node.className = "toolTerminalUtils";
};

ToolTerminalUtils.prototype.add = function(widget) {
	this.node.appendChild(widget.node);
};

var ToolTerminalUtilResize = function(module, size) {
	this.module = module;
	this.node = document.createElement("div");
	this.size = size;
	this.init();
};

ToolTerminalUtilResize.prototype.init = function() {
	var self = this;
	this.node.className = "resolution";

	this.node.appendChild(document.createTextNode(this.size.width + "×" + this.size.height));
	this.node.onclick = function() { self.onclick(); return false; };
};

ToolTerminalUtilResize.prototype.onclick = function() {
	this.module.terminal.modulePrompter.output.setSize(this.size.width, this.size.height);
};

var ToolTerminalUtilId = function(module, key) {
	this.key = key;
	this.module = module;
	this.node = document.createElement("div");
	this.init();
};

ToolTerminalUtilId.prototype.init = function() {
	var self = this;

	this.node.className = "id";
	this.node.onclick = function() { self.onclick(); return false; };
};

ToolTerminalUtilId.prototype.onclick = function() {
	this.module.terminal.client.emitId(this.key);
};



