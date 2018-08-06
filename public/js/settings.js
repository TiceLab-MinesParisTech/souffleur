var Settings = function(terminal, ref) {
	this.ref = ref ? ref : "default";
	this.terminal = terminal;
};

Settings.params = {
	"name": new SettingsParamString("name", "name", null, "<anonymous>"),
	"flip": new SettingsParamBool("flip", "flip", false),
	"mask": new SettingsParamPercent("mask", "mask", 0, -0.001, 0.4, 0.01),
	"size":	new SettingsParamPercent("size", "size", 1, 0.001, 3.001, 0.1),
	"toolbarVisibility": new SettingsParamBool("toolbarVisibility", "toolbar", true),
	"notifierVisibility": new SettingsParamBool("notifierVisibility", "notifications", true),
	"defaultTrack": new SettingsParamString("defaultTrack", "default track", "main", "<no default track>"),
	"colors": new SettingsParamChoice("colors", "colors", "", {"": "Black on white", "wb": "White on black", "gb" : "Green on black"})
};
	
Settings.prototype.applyParam = function(key) {
	if (!(key in Settings.params))
		return false;

	var value = this.getParam(key);
	var fct = "apply" + key.substr(0, 1).toUpperCase() + key.substr(1);
	if (fct in this.terminal) this.terminal[fct](value);
};

Settings.prototype.setParam = function(key, value) {
	if (!(key in Settings.params))
		return false;

	this.terminal.client.emitSettingsParam(null, key, value);
};

Settings.prototype.notifyParam = function(key, value) {
	if (!(key in Settings.params))
		return false;

	var param = Settings.params[key];
	this.terminal.notifier.showParam(param.getTitle(), param.render(value));
};

Settings.prototype.saveParam = function(key, value) {
	if (!(key in Settings.params))
		return false;

	var value = window.localStorage.setItem(this.ref + "::" + key, value);
	this.applyParam(key, value);
	this.emit();
}

Settings.prototype.getParam = function(key) {
	if (!(key in Settings.params))
		return undefined;

	var value = window.localStorage.getItem(this.ref + "::" + key);

	var param = Settings.params[key];
	return value == null ? param.getDefaultValue() : param.parse(value);
};

Settings.prototype.switchParam = function(key) {
	this.setParam(key, !this.getParam(key));
};

Settings.prototype.get = function() {
	var result = {};
	for (key in Settings.params) {
		result[key] = this.getParam(key);
	}
	return result;
}

Settings.prototype.applyParams = function() {
	for (key in Settings.params) {
		var param = Settings.params[key];
		this.applyParam(key);
	}	
}

Settings.prototype.emit = function() {
	this.terminal.client.emitSettings(this.get());
}
