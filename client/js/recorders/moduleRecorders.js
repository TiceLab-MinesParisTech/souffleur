var ModuleRecorders = function(terminal) {
	this.terminal = terminal;

	this.tally = new Tally(this);
	this.actionRecorders = new ActionRecorders(this);
	
	this.init();
};

ModuleRecorders.prototype.init = function() {
	var self = this;
	
	this.terminal.actionbar.addAction(this.actionRecorders);
	this.terminal.keyboard.on("F5", function() { self.kbdRecordStartStop(); });
	this.terminal.foreground.add(this.tally);

	this.on("status", function(args) { self.onStatus(args); });
	this.on("state", function(args) { self.onState(args); });

};

ModuleRecorders.prototype.emit = function(name, args) {
	this.terminal.client.emit("recorders::" + name, args);
};

ModuleRecorders.prototype.on = function(name, cb) {
	this.terminal.client.on("recorders::" + name, cb);
};

ModuleRecorders.prototype.onStatus = function(args) {
	this.actionRecorders.showStatus(args);
};

ModuleRecorders.prototype.onState = function(value) {
	this.actionRecorders.setState(value);
};

ModuleRecorders.prototype.start = function() {
	var fileId = null;
//	var fileId = this.menubar.toolFile.getId();
	this.emitStart(fileId ? fileId + "-%src%" : null);
};

ModuleRecorders.prototype.stop = function() {
	this.emitStop();
};

ModuleRecorders.prototype.emitStart = function(name) {
	this.emit('start', name ? name : null);
};

ModuleRecorders.prototype.emitStop = function() {
	this.emit('stop');
};


