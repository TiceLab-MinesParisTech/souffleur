var Infobar = function() {
	this.node = document.createElement("div");
	this.nodeTitle = document.createElement("span");
	this.info = {};
	this.init();
};

Infobar.prototype.init = function() {
	this.node.className = "tool infobar";

	this.nodeTitle.appendChild(document.createTextNode(""));
	this.node.appendChild(this.nodeTitle);
	this.setVisibility(false);
};

Infobar.prototype.set = function(name, value) {
	this.info[name] = value;
	this.update();
};

Infobar.prototype.update = function() {
	var title = false;
	if ("filename" in this.info) title = this.info.filename;
	if ("id" in this.info) title = this.info.id;
	this.setVisibility(title != false);
	this.nodeTitle.firstChild.nodeValue = title;
	console.log(title);
};

Infobar.prototype.setVisibility = function(value) {
	this.node.style.display = value ? "" : "none";
};

