var ModuleDmx = function(terminal) {
	this.terminal = terminal;
	this.toolDmx = new ToolDmx(this);
	
	this.init();
};

ModuleDmx.prototype.init = function() {
	var self = this;
	
	this.terminal.menubar.addTool("Lighting", this.toolDmx);

	this.on("dmx::faders::set", function(args) { self.onSetValue(args); });
	this.on("dmx::faders::configure", function(args) { self.onConfigure(args); });
};

ModuleDmx.prototype.on = function(name, cb) {
	this.terminal.client.on(name, cb);
};

ModuleDmx.prototype.emit = function(name, args) {
	this.terminal.client.emit(name, args);
};

ModuleDmx.prototype.emitSetValue = function(ref, value) {
	this.emit("dmx::faders::set", {"ref": ref, "value": value});
};

ModuleDmx.prototype.onSetValue = function(args) {
	this.toolDmx.faders.onSetValue(args.ref, args.value);
};

ModuleDmx.prototype.onConfigure = function(args) {
	this.toolDmx.configure(args);
};

