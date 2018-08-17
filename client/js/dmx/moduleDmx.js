var ModuleDmx = function(terminal) {
	this.terminal = terminal;
	this.toolDmx = new ToolDmx(this);
	this.menuItem = null;
	this.init();
};

ModuleDmx.prototype.init = function() {
	var self = this;
	
	this.menuItem = this.terminal.menubar.addTool("Lighting", this.toolDmx);
	this.menuItem.setVisibility(false);

	this.on("dmx::controls::set", function(args) { self.onSetValue(args); });
	this.on("dmx::controls::configure", function(args) { self.onConfigure(args); });
};

ModuleDmx.prototype.on = function(name, cb) {
	this.terminal.client.on(name, cb);
};

ModuleDmx.prototype.emit = function(name, args) {
	this.terminal.client.emit(name, args);
};

ModuleDmx.prototype.emitSetValue = function(ref, value) {
	this.emit("dmx::controls::set", {"ref": ref, "value": value});
};

ModuleDmx.prototype.onSetValue = function(args) {
	this.toolDmx.faders.onSetValue(args.ref, args.value);
};

ModuleDmx.prototype.onConfigure = function(args) {
	this.menuItem.setVisibility(true);
	this.toolDmx.configure(args);
};

ModuleDmx.prototype.emitSave = function(name) {
	this.emit("dmx::save", name);
};

