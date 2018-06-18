var ToolAbout = function() {
	this.node = document.createElement("button");
	this.popup = document.createElement("div");
	this.init();
};

ToolAbout.prototype.init = function() {
	var self = this;
	this.node.appendChild(document.createTextNode("About"));
	this.node.onclick = function() { self.switchVisibility() };
	this.node.className = "toolAbout";
	this.node.appendChild(this.popup);

	this.popup.className = "popup";
	this.popup.appendChild(document.createTextNode("version git"));
	this.setVisibility(false);
};


ToolAbout.prototype.setVisibility = function(value) {
	this.popup.style.display = value ? "" : "none";
};

ToolAbout.prototype.getVisibility = function(value) {
	return this.popup.style.display == "" ? true : false;
};

ToolAbout.prototype.switchVisibility = function() {
	this.setVisibility(!this.getVisibility());
};

