var Actionbar = function(terminal) {
	this.node = document.createElement("div");
//	this.toolRecorder = new ToolRecorder(terminal);
	this.init();
};

Actionbar.prototype.init = function() {
	this.node.className = "actionbar";
//	this.node.appendChild(this.toolRecorder.node);
};

Actionbar.prototype.addAction = function(action) {
	this.node.appendChild(action.node);
};

Actionbar.prototype.setVisibility = function(value) {
	this.node.style.display = value ? "" : "none";
};

Actionbar.prototype.getVisibility = function(value) {
	return this.node.style.display == "" ? true : false;
};

Actionbar.prototype.switchVisibility = function() {
	this.setVisibility(!this.getVisibility());
};

