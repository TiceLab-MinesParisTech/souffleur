var Actionbar = function(terminal) {
	this.terminal = terminal;

	this.node = document.createElement("div");
	
	this.toolStartStop = new ToolStartStop(terminal);
	this.init();
};

Actionbar.prototype.init = function() {
	this.node.className = "actionbar";

	this.node.appendChild(this.toolStartStop.node);
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

