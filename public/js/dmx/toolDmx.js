var ToolDmx = function(terminal) {
	this.terminal = terminal;
	this.faders = new Faders(this);
	
	this.node = document.createElement("div");
	this.nodeButton = document.createElement("button");
	this.nodePopup = document.createElement("nav");
	this.init();
};

ToolDmx.prototype.onclick = function() {
	this.switchVisibility();
};

ToolDmx.prototype.getVisibility = function(value) {
	return this.nodePopup.style.display == "";
};

ToolDmx.prototype.setVisibility = function(value) {
	this.nodePopup.style.display = value ? "" : "none";
};

ToolDmx.prototype.setEnabled = function(value) {
	this.node.style.display = value ? "" : "none";
};

ToolDmx.prototype.switchVisibility = function() {
	this.setVisibility(!this.getVisibility());
};

ToolDmx.prototype.configure = function(arr) {
	this.faders.setChannels(arr.channels);
	this.faders.configure(arr.faders);
	this.nodePopup.appendChild(this.faders.node);
};

ToolDmx.prototype.init = function() {
	var self = this;
	
	this.node.className = "toolDmx";
	this.nodeButton.appendChild(document.createTextNode("DMX"));
	
	this.node.appendChild(this.nodeButton);
	this.node.appendChild(this.nodePopup);
	this.nodeButton.onclick = function() { self.onclick() };
	this.setVisibility(false);

	this.terminal.client.socket.on("dmx::faders::set", function(args) { self.onSetValue(args); });
	this.terminal.client.socket.on("dmx::faders::configure", function(args) { self.onConfigure(args); });
	this.setEnabled(false);
};

ToolDmx.prototype.emit = function(name, args) {
	this.terminal.client.emit(name, args);
};

ToolDmx.prototype.emitSetValue = function(ref, value) {
	this.emit("dmx::faders::set", {"ref": ref, "value": value});
};

ToolDmx.prototype.onSetValue = function(args) {
	this.faders.setValue(args.ref, args.value);
};

ToolDmx.prototype.onConfigure = function(args) {
	this.configure(args);
	this.setEnabled(true);
};

