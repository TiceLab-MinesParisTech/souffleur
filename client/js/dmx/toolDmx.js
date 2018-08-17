var ToolDmx = function(module) {
	this.module = module;
	this.faders = new Faders(module);
	
	this.node = document.createElement("div");
	this.saveNode = document.createElement("button");
	this.init();
};

ToolDmx.prototype.setEnabled = function(value) {
	//this.node.style.display = value ? "" : "none";
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
	
//	this.setEnabled(false);
};

ToolDmx.prototype.save = function() {
	this.module.emitSave("default");
};

