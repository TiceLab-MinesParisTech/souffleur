var ToolFile = function(terminal) {
	this.terminal = terminal;
	
	this.node = document.createElement("nav");

	this.id = null;
	this.filename = null;
	
	this.tabs = new ToolTabs();
	this.editor = new ToolFileEdit(terminal, this);
	this.list = new ToolFileList(terminal, this);
	this.init();
};

ToolFile.prototype.init = function() {
	var self = this;

	this.node.className = "toolFile";
	
	this.node.appendChild(this.tabs.node);

	var item = this.tabs.addTab("Open", this.list.node, function() { self.list.show() } );
	this.tabs.addTab("Edit", this.editor.node);	
	this.tabs.setCurrentItem(item);
};

ToolFile.prototype.dirname = function(path) {
	return path.substr(0, path.lastIndexOf("/"));
};

ToolFile.prototype.loadText = function(filename, text) {
	this.close();

	this.editor.setFilename(filename);
	this.editor.setValue(text);

	var file = new FileTxt(filename, "files/" + this.dirname(filename));
	file.parse(text);
	this.terminal.client.emitLoadTracks(file.get());
};

ToolFile.prototype.updateTitle = function() {
	var title = this.filename;
	if (this.id) title = this.id;
//	this.nodeButton.firstChild.nodeValue = title ? title : "File";
};

ToolFile.prototype.setFilename = function(value) {
	this.filename = value;
	this.updateTitle();
};

ToolFile.prototype.getFilename = function() {
	return this.filename;
};

ToolFile.prototype.setId = function(value) {
	this.id = value;
	this.updateTitle();
};

ToolFile.prototype.getId = function() {
	return this.id;
};

