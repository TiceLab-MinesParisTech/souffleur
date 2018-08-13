var ToolTerminalUtils = function() {
	this.node = document.createElement("nav");
	this.node.className = "toolTerminalUtils";
};

ToolTerminalUtils.prototype.add = function(widget) {
	this.node.appendChild(widget.node);
};

var ToolTerminalUtilResize = function(module, size) {
	this.module = module;
	this.target = module.terminal.modulePrompter.output;
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
	this.target.setSize(this.size.width, this.size.height);
};

var ToolTerminalUtilResetSize = function(module) {
	this.module = module;
	this.target = module.terminal.modulePrompter.output;
	this.node = document.createElement("div");
	this.init();
};

ToolTerminalUtilResetSize.prototype.init = function() {
	var self = this;
	this.node.className = "resolution";

	this.node.appendChild(document.createTextNode("Fullscreen"));
	this.node.onclick = function() { self.onclick(); return false; };
};

ToolTerminalUtilResetSize.prototype.setVisibility = function(value) {
	this.node.style.display = value ? "" : "none";
};

ToolTerminalUtilResetSize.prototype.onclick = function() {
	this.target.resetSize();
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



