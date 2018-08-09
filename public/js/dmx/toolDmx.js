var ToolDmx = function(terminal) {
	this.terminal = terminal;
	this.faders = new Faders(this);
	
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
	
	this.on("dmx::faders::set", function(args) { self.onSetValue(args); });
	this.on("dmx::faders::configure", function(args) { self.onConfigure(args); });
//	this.setEnabled(false);
};

ToolDmx.prototype.on = function(name, cb) {
	this.terminal.client.socket.on(name, cb);
};

ToolDmx.prototype.emit = function(name, args) {
	this.terminal.client.emit(name, args);
};

ToolDmx.prototype.emitSetValue = function(ref, value) {
	this.emit("dmx::faders::set", {"ref": ref, "value": value});
};

ToolDmx.prototype.onSetValue = function(args) {
	this.faders.onSetValue(args.ref, args.value);
};

ToolDmx.prototype.onConfigure = function(args) {
	this.configure(args);
	this.setEnabled(true);
};

