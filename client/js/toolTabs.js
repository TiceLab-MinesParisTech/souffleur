var ToolTabs = function() {
	this.node = document.createElement("div");
	this.nodeMenu = document.createElement("ul");
	this.nodeContent = document.createElement("div");
	this.current = null;
	this.init();
};

ToolTabs.prototype.init = function() {
	this.node.className = "toolTabs";
	this.node.appendChild(this.nodeMenu);
	this.node.appendChild(this.nodeContent);
};

ToolTabs.prototype.update = function() {
	this.current.setCurrent(true);
};

ToolTabs.prototype.setContent = function(node) {
	while (this.nodeContent.firstChild) this.nodeContent.removeChild(this.nodeContent.firstChild);
	this.nodeContent.appendChild(node);
};

ToolTabs.prototype.addTab = function(title, node, cb) {
	var item = new ToolTabsItem(this, title, node, cb);
	this.nodeMenu.appendChild(item.label);
	return item;
};

ToolTabs.prototype.setCurrentItem = function(item) {
	if (item == this.current) return;
	
	if (this.current) this.current.setCurrent(false);
	this.current = item;
	item.setCurrent(true);

	this.setContent(item.content);
};

var ToolTabsItem = function(tabs, title, content, cb) {
	var self = this;
	
	this.label = document.createElement("li");
	this.label.appendChild(document.createTextNode(title));
	this.label.onclick = function() { tabs.setCurrentItem(self); };

	this.content = content;
	this.cb = cb;
};

ToolTabsItem.prototype.setCurrent = function(value) {
	if (value) {
		if (this.cb) this.cb();
	}
	this.label.className = value ? "current" : "";
};
