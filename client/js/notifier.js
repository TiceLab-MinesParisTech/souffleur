var Notifier = function() {
	this.node = document.createElement("div");
	this.timeout = null;
	this.enabled = false;	
	this.visible = true;
	this.flip = false;
	this.actived = false;
		
	this.init();
}

Notifier.prototype.setClassName = function() {
	this.node.className = "notifier" + (this.flip ? " flip" : "") + (this.actived ? " active" : "");
};

Notifier.prototype.init = function() {
	this.setClassName();
};

Notifier.prototype.setFlip = function(value) {
	this.flip = value;
	this.setClassName();
};

Notifier.prototype.unactive = function() {
	this.actived = false;
	this.setClassName();
	this.timeout = null;
};

Notifier.prototype.active = function(force) {
	if (this.timeout) clearTimeout(this.timeout);

	var self = this;
	this.actived = true;
	this.setClassName();
	this.timeout = setTimeout(function() {
		self.unactive();
	}, 1500);
};

Notifier.prototype.show = function(str, force) {
	if (!force && (!this.enabled || !this.visible)) return;

	while (this.node.firstChild) this.node.removeChild(this.node.firstChild);
	this.node.appendChild(document.createTextNode(str));
	this.active(force);
};

Notifier.prototype.showParam = function(title, value, className) {
	this.show(title + " : " + value);
};

Notifier.prototype.setEnabled = function(value) {
	this.enabled = value;
};

Notifier.prototype.setVisibility = function(value) {
	this.visible = value;
};

Notifier.prototype.getVisibility = function() {
	return this.visible;
};
