var ToolDmx = function(module) {
	this.module = module;
	this.faders = new Faders(module);
	
	this.node = document.createElement("div");
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
	
//	this.setEnabled(false);
};


