var SettingsExternal = function(terminal, socketid, values) {
	this.terminal = terminal;
	this.socketid = socketid;
	this.params = terminal.settings.params;
	this.values = values;
};

SettingsExternal.prototype.getParam = function(key) {
	return this.values[key];
};

SettingsExternal.prototype.setParam = function(key, value) {
	this.saveParam(key, value);
	this.terminal.client.emitSettingsParam(this.socketid, key, value);
};

SettingsExternal.prototype.saveParam = function(key, value) {
	this.values[key] = value;
};

SettingsExternal.prototype.getKey = function() {
	return this.socketid;
};
