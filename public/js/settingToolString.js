var SettingToolString = function(settings, param) {
	SettingTool.call(this, settings, param);
	
	this.node = document.createElement("form");
	this.input = document.createElement("input");
	this.button = document.createElement("button");

	this.init();
}

SettingToolString.prototype = Object.create(SettingTool.prototype);

SettingToolString.prototype.show = function(value) {
	this.input.value = value;
};

SettingToolString.prototype.onsubmit = function(e) {
	this.set(this.input.value);
	return false;
};

SettingToolString.prototype.init = function() {
	var self = this;
	this.node.className = "settingToolString";
	
	this.node.appendChild(this.input);

	this.node.appendChild(this.button);
	this.button.appendChild(document.createTextNode("Ok"));

	this.input.placeholder = this.param.placeholder;
	this.input.id = this.getId();

	this.node.onsubmit = function(e) { return self.onsubmit(e); }
	this.show(this.get());
}

