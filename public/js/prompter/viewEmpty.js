var ViewEmpty = function() {
	this.node = document.createElement("div");
	this.node.appendChild(document.createTextNode("Please, open a document"));
	this.node.className = "viewEmpty";
};

ViewEmpty.prototype.setPosition = function(position) {
};

ViewEmpty.prototype.getPosition = function() {
	return 0;
};

ViewEmpty.prototype.getDuration = function() {
	return 0;
};

ViewEmpty.prototype.load = function(track) {
	console.log("load");
};

ViewEmpty.prototype.setFlip = function(value) {
	this.flip = value;
	this.setClassName();
};

ViewEmpty.prototype.next = function() {
};

ViewEmpty.prototype.previous = function() {
};

ViewEmpty.prototype.setSize = function(value) {
	this.node.style.fontSize = Math.floor(value * 100) + "%";
};

