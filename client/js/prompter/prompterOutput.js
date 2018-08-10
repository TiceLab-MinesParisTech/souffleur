var PrompterOutput = function(terminal) {
	this.terminal = terminal;
	
	this.node = document.createElement("div");
	this.node.className = "prompterOutput";

	this.nodeContent = document.createElement("div");
	this.nodeContent.className = "content";

	this.mask = new Mask();
	this.node.appendChild(this.mask.node);

	this.node.appendChild(this.nodeContent);
};

PrompterOutput.prototype.resetSize = function() {
	this.node.style.top = "";
	this.node.style.left = "";
	this.node.style.width = "";
	this.node.style.height = "";
};

PrompterOutput.prototype.setSize = function(width, height) {
	this.node.style.top = "60px";
	this.node.style.left = "10px";
	this.node.style.width = width + "px";
	this.node.style.height = height + "px";
};

PrompterOutput.prototype.setContent = function(node) {
	while (this.nodeContent.firstChild) this.nodeContent.removeChild(this.nodeContent.firstChild);
	this.nodeContent.appendChild(node);
};
