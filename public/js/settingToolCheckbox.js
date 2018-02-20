var SettingToolCheckbox = function(settings, param) {
	SettingTool.call(this, settings, param);
	
	this.node = document.createElement("input");

	this.init();
};

SettingToolCheckbox.prototype = Object.create(SettingTool.prototype);

SettingToolCheckbox.prototype.init = function() {
	var self = this;

	this.node.className = "settingToolCheckbox";
	this.node.id = this.getId();
	this.node.type = "checkbox";
	this.node.onchange = function(e) { self.onchange(e); }
	this.show(this.get());
};

SettingToolCheckbox.prototype.show = function(value) {
	this.node.checked = value;
};

SettingToolCheckbox.prototype.onchange = function(value) {
	this.set(this.node.checked);
};
