var Mask = function() {
	this.node = document.createElement("div");
	this.node.className = "Mask";

	this.top = document.createElement("div");
	this.top.className = "top";
	this.node.appendChild(this.top);
	
	this.bottom = document.createElement("div");
	this.bottom.className = "bottom";
	this.node.appendChild(this.bottom);
};

Mask.prototype.set = function(value) {
	this.node.style.display = value >= 0.001 ? "" : "none";

	var height = Math.round(value * 100) + "%";
	this.top.style.height = height;
	this.bottom.style.height = height;
};
