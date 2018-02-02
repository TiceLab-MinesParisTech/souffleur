var ToolSpeed = function(terminal) {
	this.terminal = terminal;

	this.buttonMore = document.createElement("button");
	this.buttonLess = document.createElement("button");
	this.label = document.createElement("div");
	this.node = document.createElement("div");
	this.speed = null;

	this.init();
}

ToolSpeed.prototype.emitIncSpeed = function(value) {
	this.terminal.emitSetSpeed(Math.round((this.speed + value) * 10) / 10);
}

ToolSpeed.prototype.setSpeed = function(value) {
	this.speed = value;
	var str = Math.floor(value * 100) + "%";
	this.label.firstChild.nodeValue = str;
	this.terminal.notifier.showParam("speed", str);
}

ToolSpeed.prototype.getSpeed = function() {
	return this.speed;
}

ToolSpeed.prototype.init = function() {
	var self = this;

	this.node.className = "toolSpeed";
	
	this.buttonLess.appendChild(document.createTextNode("−"));
	this.node.appendChild(this.buttonLess);

	this.node.appendChild(this.label);
	this.label.className = "label";
	this.label.appendChild(document.createTextNode(""));
	this.setSpeed(1);

	this.buttonMore.appendChild(document.createTextNode("+"));
	this.node.appendChild(this.buttonMore);

	this.buttonMore.onclick = function() {
		self.emitIncSpeed(0.1);
	};

	this.buttonLess.onclick = function() {
		self.emitIncSpeed(-0.1);
	};
}
