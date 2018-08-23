var ModuleDmx = function(terminal) {
	this.terminal = terminal;
	this.toolDmx = new ToolDmx(this);
	this.toolConnectable = new ToolConnectable(this);
	this.menuItem = null;
	this.init();
};

ModuleDmx.prototype.init = function() {
	var self = this;
	
	this.toolConnectable.setContent(this.toolDmx);
	this.toolConnectable.on("connect", function() { self.emitConnect() });
	this.menuItem = this.terminal.menubar.addTool("Lighting", this.toolConnectable);
	this.menuItem.setVisibility(false);

	this.on("controls::set", function(args) { self.onSetValue(args); });
	this.on("controls::configure", function(args) { self.onConfigure(args); });
	this.on("connected", function(value) { self.onConnected(value); });
};

ModuleDmx.prototype.on = function(name, cb) {
	this.terminal.client.on("dmx::" + name, cb);
};

ModuleDmx.prototype.emit = function(name, args) {
	this.terminal.client.emit("dmx::" + name, args);
};

ModuleDmx.prototype.emitSetValue = function(ref, value) {
	this.emit("controls::set", {"ref": ref, "value": value});
};

ModuleDmx.prototype.onSetValue = function(args) {
	this.toolDmx.faders.onSetValue(args.ref, args.value);
};

ModuleDmx.prototype.onConfigure = function(args) {
	this.menuItem.setVisibility(true);
	this.toolDmx.configure(args);
};

ModuleDmx.prototype.onConnected = function(value) {
	this.toolConnectable.setState(value);
};

ModuleDmx.prototype.emitConnect = function() {
	this.emit("connect");
};

ModuleDmx.prototype.emitSave = function(name) {
	this.emit("save", name);
};

