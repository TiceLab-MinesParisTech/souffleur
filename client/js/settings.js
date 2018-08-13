var Settings = function(terminal, ref) {
	this.ref = ref ? ref : "default";
	this.terminal = terminal;
	this.params = {};
};

Settings.prototype.addParam = function(setting) {
	this.params[setting.getKey()] = setting;
};
	
Settings.prototype.applyParam = function(key) {
	if (!(key in this.params))
		return false;

	var value = this.getParam(key);
	var param = this.params[key];

	param.apply(value)
};

Settings.prototype.setParam = function(key, value) {
	if (!(key in this.params))
		return false;

	this.terminal.client.emitSettingsParam(null, key, value);
};

Settings.prototype.notifyParam = function(key, value) {
	if (!(key in this.params))
		return false;

	var param = this.params[key];
	this.terminal.notifier.showParam(param.getTitle(), param.render(value));
};

Settings.prototype.saveParam = function(key, value) {
	if (!(key in this.params))
		return false;

	var value = window.localStorage.setItem(this.ref + "::" + key, value);
	this.applyParam(key, value);
	this.emit();
}

Settings.prototype.getParam = function(key) {
	if (!(key in this.params))
		return undefined;

	var value = window.localStorage.getItem(this.ref + "::" + key);

	var param = this.params[key];
	return value == null ? param.getDefaultValue() : param.parse(value);
};

Settings.prototype.switchParam = function(key) {
	this.setParam(key, !this.getParam(key));
};

Settings.prototype.renderParam = function(key) {
	var value = this.getParam(key);

	var param = this.params[key];
	return param.render(value);
};

Settings.prototype.get = function() {
	var result = {};
	for (key in this.params) {
		result[key] = this.getParam(key);
	}
	return result;
};

Settings.prototype.applyParams = function() {
	for (key in this.params) {
		var param = this.params[key];
		this.applyParam(key);
	}	
};

Settings.prototype.emit = function() {
	this.terminal.client.emitSettings(this.get());
};
