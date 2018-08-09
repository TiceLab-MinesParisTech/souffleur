var SettingsEditor = function(settings) {
	this.settings = settings;

	this.tools = [
		new SettingToolString(settings, Settings.params.name),
		new SettingToolSize(settings, Settings.params.size),
		new SettingToolSize(settings, Settings.params.mask),
		new SettingToolCheckbox(settings, Settings.params.flip),
		new SettingToolCheckbox(settings, Settings.params.toolbarVisibility),
		new SettingToolCheckbox(settings, Settings.params.notifierVisibility),
		new SettingToolString(settings, Settings.params.defaultTrack),
		new SettingToolSelect(settings, Settings.params.colors)
	];

	this.node = document.createElement("div");
	this.init();
}

SettingsEditor.prototype.createRow = function(title, node, name) {
	var tr = document.createElement("tr");
	this.node.appendChild(tr);

	var label = document.createElement("label");
	label.setAttribute("for", name);
	label.appendChild(document.createTextNode(title));
	
	var th = document.createElement("th");
	th.appendChild(label);
	tr.appendChild(th);

	var td = document.createElement("td");
	td.appendChild(node);
	tr.appendChild(td);

	return tr;
};

SettingsEditor.prototype.init = function() {
	var self = this;

	this.node.className = "settingsEditor";

	var table = document.createElement("table");
	for (var i = 0; i < this.tools.length; i++) {
		var tool = this.tools[i];
		table.appendChild(this.createRow(tool.param.getTitle(), tool.node, tool.getId()));
	}
	this.node.appendChild(table);
};

SettingsEditor.prototype.show = function(key, value) {
	this.settings.saveParam(key, value);
	for (var i = 0; i < this.tools.length; i++) {
		var tool = this.tools[i];
		if (tool.param.getKey() == key) {
			tool.show(value);
			return;
		}
	}
};
