var ActionJump = function(module) {
	this.module = module;

	this.buttonNext = document.createElement("button");
	this.buttonPrev = document.createElement("button");
	this.node = document.createElement("div");

	this.init();
}


ActionJump.prototype.init = function() {
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

ActionJump.prototype.begining = function() {
	this.module.view.setPosition(0);
}

ActionJump.prototype.previous = function() {
	this.module.view.previous();
}

ActionJump.prototype.next = function() {
	this.module.view.next();
}
