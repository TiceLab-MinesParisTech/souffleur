var SettingsExternal = function(terminal, socketid, settings) {
	this.terminal = terminal;
	this.socketid = socketid;
	this.settings = settings;
};

SettingsExternal.prototype.getParam = function(key) {
	return this.settings[key];
};

SettingsExternal.prototype.setParam = function(key, value) {
	this.saveParam(key, value);
	this.terminal.client.emitSettingsParam(this.socketid, key, value);
};

SettingsExternal.prototype.saveParam = function(key, value) {
	this.settings[key] = value;
};

SettingsExternal.prototype.getKey = function() {
	return this.socketid ? this.socketid : "local";
};
