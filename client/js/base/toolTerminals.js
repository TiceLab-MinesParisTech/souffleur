var ToolTerminals = function(module) {
	this.module = module;

	this.node = document.createElement("nav");
	this.terminals = [];
	this.init();
}

ToolTerminals.prototype.init = function() {
	this.node.className = "toolTerminals";
}

ToolTerminals.prototype.clear = function() {
	this.terminals = [];
	while (this.node.firstChild) this.node.removeChild(this.node.firstChild);
};

ToolTerminals.prototype.addTerminal = function(terminal) {
	this.terminals.push(terminal);
	this.node.appendChild(terminal.node);
};

ToolTerminals.prototype.showExternal = function(socketid, data) {
	var terminal = new ToolTerminalExternal(this.module, socketid, data);
	this.addTerminal(terminal);
};

ToolTerminals.prototype.showExternals = function(list) {
	for (var i = 0; i < list.length; i++) {
		var arr = list[i];
		if (arr.socketid) {
			this.showExternal(arr.socketid, arr.data);
		}
	}
};

ToolTerminals.prototype.show = function() {
	var self = this;
	
	this.clear();

	this.addTerminal(new ToolTerminalLocal(this.module));

	this.module.terminal.client.loadClientsList(function(data) {
		self.showExternals(data);
	});
}

ToolTerminals.prototype.showParam = function(socketid, key, value) {
	for (var i = 0; i < this.terminals.length; i++) {
		var terminal = this.terminals[i];
		if (terminal.key == socketid) {
			terminal.toolSettings.show(key, value);
		}
	}
};


