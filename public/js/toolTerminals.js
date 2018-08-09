var ToolTerminals = function(terminal) {
	this.terminal = terminal;

	this.node = document.createElement("nav");
	this.items = [];
	this.init();
}

ToolTerminals.prototype.onclick = function() {
	if (!this.getVisibility()) {
		this.show();
	}
	else {
		this.setVisibility(false);
	}
}

ToolTerminals.prototype.init = function() {
	this.node.className = "toolTerminals";
}

ToolTerminals.prototype.clearItems = function() {
	this.items = [];
	while (this.node.firstChild) this.node.removeChild(this.node.firstChild);
};

ToolTerminals.prototype.addItem = function(item, ontop) {
	this.items.push(item);
	if (ontop)
		this.node.insertBefore(item.node, this.node.firstChild);
	else
		this.node.appendChild(item.node);
};

ToolTerminals.prototype.setItems = function(list) {
	this.clearItems();
	for (var i = 0; i < list.length; i++) {
		var arr = list[i];
		var item = new ToolTerminalsItem(this.terminal, arr);
		this.addItem(item, arr.socketid == null);
	}
	if (this.items.length < 1) {
		this.node.appendChild(document.createTextNode("No connected terminals"));
	}
}

ToolTerminals.prototype.show = function() {
	var self = this;
	this.terminal.client.loadClientsList(function(data) {
		self.setItems(data);
	});
}

ToolTerminals.prototype.showParam = function(socketid, key, value) {
	for (var i = 0; i < this.items.length; i++) {
		var item = this.items[i];
		if (item.socketid == socketid) {
			item.settingsEditor.show(key, value);
		}
	}
};

var ToolTerminalsItem = function(terminal, arr) {
	this.terminal = terminal;
	this.socketid = arr.socketid;
	this.data = arr.data;
	
	this.node = document.createElement("div");

	this.settingsExternal = new SettingsExternal(terminal, arr.socketid, arr.data.settings);
	this.settingsEditor = new SettingsEditor(this.settingsExternal);

	this.init();
};

ToolTerminalsItem.prototype.id = function() {
	this.terminal.client.emitId(this.socketid);
};

ToolTerminalsItem.prototype.resize = function() {
	this.terminal.output.setSize(this.data.size.width, this.data.size.height);
};

ToolTerminalsItem.prototype.resetSize = function() {
	this.terminal.output.resetSize();
};

ToolTerminalsItem.prototype.init = function() {
	var self = this;
	
	this.node.className = "toolTerminalsItem" + (this.socketid == null ? this.node.className = "" : " external");

	this.node.appendChild(this.settingsEditor.node);

	var nav = document.createElement("nav");
	this.node.appendChild(nav);
	
	var div = document.createElement("div");
	div.className = "resolution";
	nav.appendChild(div);

	div.appendChild(document.createTextNode(this.data.size.width + "×" + this.data.size.height));
	div.onclick = this.socketid ? function() { self.resize() } : function() { self.resetSize() };

	var div = document.createElement("div");
	div.className = "id";
	div.onclick = function() { self.id() };
	nav.appendChild(div);
};

