var DmxModule = function(terminal) {
	this.terminal = terminal;
	this.toolDmx = new ToolDmx(this);
	
	this.init();
};

DmxModule.prototype.init = function() {
	var self = this;
	
	this.terminal.menubar.addTool("DMX", this.toolDmx);

	this.on("dmx::faders::set", function(args) { self.onSetValue(args); });
	this.on("dmx::faders::configure", function(args) { self.onConfigure(args); });
};

DmxModule.prototype.on = function(name, cb) {
	this.terminal.client.on(name, cb);
};

DmxModule.prototype.emit = function(name, args) {
	this.terminal.client.emit(name, args);
};

DmxModule.prototype.emitSetValue = function(ref, value) {
	this.emit("dmx::faders::set", {"ref": ref, "value": value});
};

DmxModule.prototype.onSetValue = function(args) {
	this.toolDmx.faders.onSetValue(args.ref, args.value);
};

DmxModule.prototype.onConfigure = function(args) {
	this.toolDmx.configure(args);
};

