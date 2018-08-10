var Tally = function(module) {
	this.node = document.createElement("div");
	this.node.className = "tally";
};

Tally.prototype.set = function(value) {
	this.node.style.display = value ? "" : "none";
};
