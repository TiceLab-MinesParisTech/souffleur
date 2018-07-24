var ToolJump = function(terminal) {
	this.terminal = terminal;

	this.buttonNext = document.createElement("button");
	this.buttonPrev = document.createElement("button");
	this.node = document.createElement("div");

	this.init();
}


ToolJump.prototype.init = function() {
	var self = this;

	this.node.className = "toolJump";
	
	this.buttonPrev.appendChild(document.createTextNode("↑"));
	this.node.appendChild(this.buttonPrev);

	this.buttonNext.appendChild(document.createTextNode("↓"));
	this.node.appendChild(this.buttonNext);

	this.buttonPrev.onclick = function() {
		self.previous();
		return false;
	};

	this.buttonNext.onclick = function() {
		self.next();
		return false;
	};
}

ToolJump.prototype.begining = function() {
	this.terminal.view.setPosition(0);
}

ToolJump.prototype.previous = function() {
	this.terminal.view.previous();
}

ToolJump.prototype.next = function() {
	this.terminal.view.next();
}
