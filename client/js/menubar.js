var Menubar = function() {
	this.node = document.createElement("nav");
	this.icon = new MenubarIcon(this);
	this.items = new MenubarItems(this);
	this.current = null;

	this.init();
};

Menubar.prototype.addTool = function(title, tool) {
	this.items.addItem(new MenubarItem(this, title, tool));
};

Menubar.prototype.init = function() {
	this.node.className = "tool menubar";
	this.node.appendChild(this.icon.node);
	this.node.appendChild(this.items.node);
	
	this.items.setVisibility(false);
};

Menubar.prototype.setCurrent = function(item) {
	if (this.current == item) return;
	
	if (this.current) this.current.setCurrent(false);
	this.current = item;
	if (this.current) this.current.setCurrent(true);
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

var MenubarItem = function(menubar, title, tool) {
	var self = this;
	this.menubar = menubar;
	this.tool = tool;

	this.node = document.createElement("li");

	this.nodeTitle = document.createElement("div");
	this.nodeContent = document.createElement("div");

	this.nodeTitle.appendChild(document.createTextNode(title));
	this.nodeTitle.className = "title";
	this.nodeTitle.addEventListener("click", function(e) { return self.onclick(e); });
	this.node.appendChild(this.nodeTitle);

	this.node.appendChild(this.nodeContent);
	this.nodeContent.className = "tool";
	
	this.nodeContent.appendChild(tool.node);
	this.tool.close = function() { self.close() };
};
 
MenubarItem.prototype.onclick = function(e) {
	this.menubar.setCurrent(this.isCurrent ? null : this);
	return false;
};

MenubarItem.prototype.close = function() {
	this.menubar.items.setVisibility(false);
};

MenubarItem.prototype.setCurrent = function(value) {
	this.isCurrent = value;
	if ("show" in this.tool) this.tool.show();
	this.node.className = value ? "current" : "";
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


