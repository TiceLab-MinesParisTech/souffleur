var Tally = function(terminal) {
	this.node = document.createElement("div");
	this.node.className = "tally";
};

Tally.prototype.set = function(value) {
	this.node.style.display = value ? "" : "none";
};