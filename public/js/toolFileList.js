var ToolFileList = function(terminal, toolFile) {
	this.terminal = terminal;
	this.toolFile = toolFile;
	
	this.node = document.createElement("div");
	this.nodeList = document.createElement("ul");

	this.init();
}

ToolFileList.prototype.init = function() {
	var self = this;

	this.node.className = "toolFileList";

	this.node.appendChild(this.nodeList);
}

ToolFileList.prototype.setFilename = function(value) {
	this.button.firstChild.nodeValue = value;
};

ToolFileList.prototype.createListItem = function(filename) {
	var self = this;
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(filename));

	li.onclick = function() {
		self.loadFile(filename);
	};
	return li;
}

ToolFileList.prototype.loadText = function(filename, text) {
	this.toolFile.loadText(filename, text);
};

ToolFileList.prototype.loadFile = function(filename) {
	var self = this;
	this.terminal.server.loadFile(filename, function(text) { self.loadText(filename, text); });
};

ToolFileList.prototype.showList = function(list) {
	while (this.nodeList.firstChild) this.nodeList.removeChild(this.nodeList.firstChild);
	for (var i = 0; i < list.length; i++) {
		var li = this.createListItem(list[i]);
		this.nodeList.appendChild(li);
	}
};

ToolFileList.prototype.show = function() {
	var self = this;
	this.terminal.server.loadFilesList(function(list) {
		self.showList(list);
	});
};

