var ToolDmx = function(module) {
	this.module = module;
	this.faders = new Faders(module);
	
	this.node = document.createElement("div");
	this.saveNode = document.createElement("button");
	this.init();
};

ToolDmx.prototype.configure = function(arr) {
	this.faders.setChannels(arr.channels);
	this.faders.configure(arr.faders);
};

ToolDmx.prototype.init = function() {
	var self = this;
	
	this.node.className = "toolDmx";
	this.node.appendChild(this.faders.node);

	this.saveNode.appendChild(document.createTextNode("Save as default"));
	this.saveNode.className = "save";
	this.saveNode.onclick = function() { self.save(); return false; };
	this.node.appendChild(this.saveNode);
};

ToolDmx.prototype.save = function() {
	this.module.emitSave("default");
};

var ToolConnectable = function() {
	this.node = document.createElement("div");
	this.nodeContent = document.createElement("div");
	this.toolConnect = new ToolConnect(this);
	this.callbacks = {};
	this.init();
};

ToolConnectable.prototype.init = function(cb) {
	this.node.className = "toolConnectable";
	this.node.appendChild(this.nodeContent);
	this.node.appendChild(this.toolConnect.node);
	this.setState(false);
};

ToolConnectable.prototype.setContent = function(widget) {
	while (this.nodeContent.firstChild) this.nodeContent.removeChild(this.nodeContent.firstChild);
	this.nodeContent.appendChild(widget.node);
};

ToolConnectable.prototype.on = function(name, cb) {
	this.callbacks[name] = cb;
};

ToolConnectable.prototype.emit = function(name, args) {
	this.callbacks[name](args);
};

ToolConnectable.prototype.setState = function(value) {
	this.nodeContent.style.display = value ? "" : "none";
	this.toolConnect.setVisibility(!value);
};

var ToolConnect = function(toolConnectable) {
	this.node = document.createElement("div");
	this.nodeButton = document.createElement("button");
	this.toolConnectable = toolConnectable;
	this.init();
};

ToolConnect.prototype.init = function() {
	var self = this;

	this.node.className = "toolConnect";
	
	var p = document.createElement("p");
	p.appendChild(document.createTextNode("Device not connected"));
	this.node.appendChild(p);

	this.nodeButton.appendChild(document.createTextNode("Connect"));
	this.nodeButton.onclick = function() { self.toolConnectable.emit("connect")};
	this.node.appendChild(this.nodeButton);
};

ToolConnect.prototype.setVisibility = function(value) {
	this.node.style.display = value ? "" : "none";
};

