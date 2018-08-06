var Toolbar = function(terminal) {
	this.terminal = terminal;

	this.toolFile = new ToolFile(terminal);
	this.toolTerminals = new ToolTerminals(terminal);
	this.toolTracksList = new ToolTracksList(terminal);
	this.toolAbout = new ToolAbout();
	this.toolDmx = new ToolDmx(terminal);

	this.tools = new ToolbarTools();
	this.icon = new ToolbarIcon(this);

	this.flip = false;
	this.minified = false;
	
	this.node = document.createElement("div");
	this.init();
};

Toolbar.prototype.init = function() {
	this.tools.add(this.toolFile.node);
	this.tools.add(this.toolTracksList.node);

//	this.tools.addSeparator();
	this.tools.add(this.toolTerminals.node);
//	this.tools.addSeparator();
	this.tools.add(this.toolDmx.node);
	this.tools.add(this.toolAbout.node);

	
	this.node.appendChild(this.icon.node);

	this.node.appendChild(this.tools.node);

	this.setClassName();
};


Toolbar.prototype.setClassName = function() {
	this.node.className = "toolbar" + (this.minified ? " minified" : "") + (this.flip ? " flip" : "");
};

Toolbar.prototype.setMinified = function(value) {
	this.tools.setVisibility(!value);
	this.minified = value;
	this.setClassName();
};

Toolbar.prototype.getMinified = function() {
	return !this.tools.getVisibility();
};

Toolbar.prototype.switchMinified = function() {
	this.setMinified(!this.getMinified());
};

Toolbar.prototype.setVisibility = function(value) {
	this.node.style.display = value ? "" : "none";
};

Toolbar.prototype.getVisibility = function(value) {
	return this.node.style.display == "" ? true : false;
};

Toolbar.prototype.switchVisibility = function() {
	this.setVisibility(!this.getVisibility());
};

Toolbar.prototype.setFlip = function(value) {
	this.flip = value;
	this.setClassName();
};

var ToolbarTools = function() {
	this.node = document.createElement("div");
	this.init();
};

ToolbarTools.prototype.init = function() {
	this.node.className = "toolbarTools";
};

ToolbarTools.prototype.add = function(node) {
	this.node.appendChild(node);
};

ToolbarTools.prototype.addSeparator = function() {
	var separator = document.createElement("div");
	separator.className = "separator";
	this.node.appendChild(separator);
};

ToolbarTools.prototype.setVisibility = function(value) {
	this.node.style.display = value ? "" : "none";
};

ToolbarTools.prototype.getVisibility = function(value) {
	return this.node.style.display == "" ? true : false;
};

ToolbarTools.prototype.switchVisibility = function() {
	this.setVisibility(!this.getVisibility());
};

var ToolbarIcon = function(toolbar) {
	this.toolbar = toolbar;

	this.node = document.createElement("button");
	this.iconNode = document.createElement("div");

	this.init();
};

ToolbarIcon.prototype.onclick = function(e) {
	this.toolbar.switchMinified();
//	this.terminal.settings.setParam("toolbarVisibility", true);
};

ToolbarIcon.prototype.init = function() {
	var self = this;
	this.node.className = "menu";
	this.node.onclick = function(e) { self.onclick(e); return false; };

	this.iconNode.className = "icon menu";
	this.node.appendChild(this.iconNode);
};


