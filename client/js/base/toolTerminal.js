var ToolTerminal = function(settings) {
	this.settings = settings;

	this.tools = [
		new SettingToolString(settings, settings.params.name),
		new SettingToolSize(settings, settings.params.size),
		new SettingToolSize(settings, settings.params.mask),
		new SettingToolCheckbox(settings, settings.params.flip),
		new SettingToolCheckbox(settings, settings.params.toolbarVisibility),
		new SettingToolCheckbox(settings, settings.params.notifierVisibility),
		new SettingToolString(settings, settings.params.defaultTrack),
		new SettingToolSelect(settings, settings.params.colors)
	];

	this.node = document.createElement("div");
	this.init();
}

ToolTerminal.prototype.createRow = function(title, node, name) {
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

ToolTerminal.prototype.init = function() {
	var self = this;

	this.node.className = "toolTerminal";

	var table = document.createElement("table");
	for (var i = 0; i < this.tools.length; i++) {
		var tool = this.tools[i];
		table.appendChild(this.createRow(tool.param.getTitle(), tool.node, tool.getId()));
	}
	this.node.appendChild(table);
};

ToolTerminal.prototype.show = function(key, value) {
	this.settings.saveParam(key, value);
	for (var i = 0; i < this.tools.length; i++) {
		var tool = this.tools[i];
		if (tool.param.getKey() == key) {
			tool.show(value);
			return;
		}
	}
};
