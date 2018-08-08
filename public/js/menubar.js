var Menubar = function(terminal) {
	this.terminal = terminal;
	
	this.node = document.createElement("nav");
	this.icon = new MenubarIcon(this);
	this.items = new MenubarItems(this);
	this.init();
};

Menubar.prototype.init = function() {
	this.node.className = "menubar";
	this.node.appendChild(this.icon.node);
	this.node.appendChild(this.items.node);
	
	this.items.addItem(new MenubarItem("File"));
	this.items.addItem(new MenubarItem("Settings"));
	this.items.addItem(new MenubarItem("DMX"));
	this.items.addItem(new MenubarItem("About…"));
	this.items.setVisibility(false);
};

Menubar.prototype.setVisibility = function(value) {
	this.node.style.display = value ? "" : "none";
};

Menubar.prototype.getVisibility = function(value) {
	return this.node.style.display == "" ? true : false;
};

Menubar.prototype.switchVisibility = function() {
	this.setVisibility(!this.getVisibility());
};

Menubar.prototype.setFlip = function(value) {
	this.flip = value;
	this.setClassName();
};

var MenubarItems = function() {
	this.node = document.createElement("ul");
	this.init();
};

MenubarItems.prototype.init = function() {
	this.node.className = "menubarItems";
};

MenubarItems.prototype.addItem = function(item) {
	this.node.appendChild(item.node);
};

MenubarItems.prototype.setVisibility = function(value) {
	this.node.style.display = value ? "" : "none";
};

MenubarItems.prototype.getVisibility = function(value) {
	return this.node.style.display == "" ? true : false;
};

MenubarItems.prototype.switchVisibility = function() {
	this.setVisibility(!this.getVisibility());
};

var MenubarIcon = function(menubar) {
	this.menubar = menubar;

	this.node = document.createElement("button");
	this.iconNode = document.createElement("div");

	this.init();
};

MenubarIcon.prototype.onclick = function(e) {
	this.menubar.items.switchVisibility();
};

MenubarIcon.prototype.init = function() {
	var self = this;
	this.node.className = "menu";
	this.node.onclick = function(e) { self.onclick(e); return false; };

	this.iconNode.className = "icon menu";
	this.node.appendChild(this.iconNode);
};

var MenubarItem = function(title, tool) {
	this.node = document.createElement("li");
	this.node.appendChild(document.createTextNode(title));
};
 

