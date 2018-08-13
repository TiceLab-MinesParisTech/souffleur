var Toolbar = function() {
	this.node = document.createElement("nav");
	this.init();
};

Toolbar.prototype.init = function() {
	this.node.className = "toolbar";
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

Toolbar.prototype.add = function(widget) {
	this.node.appendChild(widget.node);
};

