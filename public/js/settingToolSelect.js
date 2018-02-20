var SettingToolSelect = function(settings, param) {
	SettingTool.call(this, settings, param);

	this.node = document.createElement("select");
	this.init();
}

SettingToolSelect.prototype = Object.create(SettingTool.prototype);

SettingToolSelect.prototype.show = function(value) {
	this.node.value = value;
};

SettingToolSelect.prototype.onchange = function(e) {
	this.set(this.node.value);
	return false;
};

SettingToolSelect.prototype.add = function(node) {
	this.node.appendChild(node);
};

SettingToolSelect.prototype.addOption = function(value, title) {
	var option = document.createElement("option");
	option.setAttribute("value", value);
	option.appendChild(document.createTextNode(title));
	this.add(option);
};

SettingToolSelect.prototype.init = function() {
	var self = this;
	this.node.className = "SettingToolSelect";
	this.node.id = this.getId();
		
	for (var key in this.param.choices) {
		var title = this.param.choices[key];
		this.addOption(key, title);
	}
	this.show(this.get());
	this.node.onchange = function(e) { return self.onchange(e); }
};


