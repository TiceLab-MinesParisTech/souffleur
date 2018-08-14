var ToolFile = function(module) {
	this.module = module;
	
	this.node = document.createElement("nav");

	this.filename = null;
	
	this.tabs = new ToolTabs();
	this.editor = new ToolFileEdit(module, this);
	this.list = new ToolFileList(module, this);
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
	this.module.emitLoadTracks(file.get());
};

ToolFile.prototype.setFilename = function(value) {
	this.filename = value;
};

ToolFile.prototype.getFilename = function() {
	return this.filename;
};

