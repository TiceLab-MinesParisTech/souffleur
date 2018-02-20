var SettingTool = function(settings, param) {
	this.settings = settings;
	this.param = param;
};

SettingTool.prototype.get = function() {
	return this.settings.getParam(this.param.getKey());
};

SettingTool.prototype.set = function(value) {
	if (!this.param.isValid(value)) return;
	this.settings.setParam(this.param.getKey(), value);
};

SettingTool.prototype.getId = function() {
	return this.settings.getKey() + "." + this.param.getKey();
};

