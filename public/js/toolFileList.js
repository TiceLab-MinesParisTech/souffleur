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

ToolFileList.prototype.createListFileItem = function(title, path) {
	var self = this;
	var li = document.createElement("li");
	li.className = "file";
	li.appendChild(document.createTextNode(title));

	li.onclick = function() {
		self.loadFile(path);
	};
	return li;
}

ToolFileList.prototype.createListDirItem = function(title, path, items) {
	var self = this;
	var li = document.createElement("li");
	li.className = "dir";
	li.appendChild(document.createTextNode(title));
	var ul = document.createElement("ul");
	li.appendChild(ul);
	this.createDirItems(ul, items);

	return li;
}

ToolFileList.prototype.loadText = function(filename, text) {
	this.toolFile.loadText(filename, text);
};

ToolFileList.prototype.loadFile = function(filename) {
	var self = this;
	this.terminal.server.loadFile(filename, function(text) { self.loadText(filename, text); });
};

ToolFileList.prototype.createDirItems = function(ul, items) {
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		var li = (item.type == "file") 
			? this.createListFileItem(item.name, item.path)
			: this.createListDirItem(item.name, item.path, item.content);
		ul.appendChild(li);
	}
};

ToolFileList.prototype.showList = function(items) {
	while (this.nodeList.firstChild) this.nodeList.removeChild(this.nodeList.firstChild);
	this.createDirItems(this.nodeList, items);
};

ToolFileList.prototype.show = function() {
	var self = this;
	this.terminal.server.loadFilesList(function(list) {
		self.showList(list);
	});
};

