var ToolStartStop = function(terminal) {
	this.terminal = terminal;

	this.node = document.createElement("button");
	this.iconNode = document.createElement("div");
	this.value = null;
	this.init();
}

ToolStartStop.prototype.init = function() {
	var self = this;

	this.node.className = "toolStartStop";
	
	this.node.appendChild(this.iconNode);

	this.node.onclick = function(e) { self.onclick(e); return false; };
	this.setValue(false);
}

ToolStartStop.prototype.onclick = function(e) {
	this.emitPlayStop();
};

ToolStartStop.prototype.emitPlayStop = function() {
	if (this.value){
		this.terminal.emitStop();
	}
	else{
		this.terminal.emitPlay();
	}
}

ToolStartStop.prototype.setValue = function(value) {
	if (this.value == value) return;
	this.value = value;
	this.iconNode.className = value ? "icon stop" : "icon play";
	this.terminal.notifier.show(value ? "play" : "stop");
}

ToolStartStop.prototype.getValue = function() {
	return this.value;
}

