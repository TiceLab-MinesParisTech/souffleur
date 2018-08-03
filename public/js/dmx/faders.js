var Faders = function() {
	this.node = document.createElement("div");
	this.init();
};

Faders.prototype.init = function() {
	this.node.className = "faders";
};

Faders.prototype.add = function(widget) {
	this.node.appendChild(widget.node);
};


