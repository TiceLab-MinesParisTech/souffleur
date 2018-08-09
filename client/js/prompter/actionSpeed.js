var ActionSpeed = function(module) {
	this.module = module;

	this.buttonMore = document.createElement("button");
	this.buttonLess = document.createElement("button");
	this.label = document.createElement("div");
	this.node = document.createElement("div");
	this.speed = null;

	this.init();
}

ActionSpeed.prototype.emitIncSpeed = function(value) {
	this.module.emitSetSpeed(Math.round((this.speed + value) * 10) / 10);
}

ActionSpeed.prototype.setSpeed = function(value) {
	this.speed = value;
	var str = Math.floor(value * 100) + "%";
	this.label.firstChild.nodeValue = str;
	this.module.terminal.notifier.showParam("speed", str);
}

ActionSpeed.prototype.getSpeed = function() {
	return this.speed;
}

ActionSpeed.prototype.init = function() {
	var self = this;

	this.node.className = "toolSpeed";
	
	this.buttonMore.appendChild(document.createTextNode("+"));
	this.node.appendChild(this.buttonMore);

	this.node.appendChild(this.label);
	this.label.className = "label";
	this.label.appendChild(document.createTextNode(""));
	this.setSpeed(1);

	this.buttonLess.appendChild(document.createTextNode("−"));
	this.node.appendChild(this.buttonLess);

	this.buttonMore.onclick = function() {
		self.emitIncSpeed(0.1);
		return false;
	};

	this.buttonLess.onclick = function() {
		self.emitIncSpeed(-0.1);
		return false;
	};
}
