var ActionStartStop = function(module) {
	this.module = module;

	this.node = document.createElement("button");
	this.iconNode = document.createElement("div");
	this.value = null;
	this.init();
}

ActionStartStop.prototype.init = function() {
	var self = this;

	this.node.className = "actionStartStop";
	
	this.node.appendChild(this.iconNode);

	this.node.onclick = function(e) { self.onclick(e); return false; };
	this.setValue(false);
}

ActionStartStop.prototype.onclick = function(e) {
	this.emitPlayStop();
};

ActionStartStop.prototype.emitPlayStop = function() {
	if (this.value){
		this.module.emitStop();
	}
	else{
		this.module.emitPlay();
	}
}

ActionStartStop.prototype.setValue = function(value) {
	if (this.value == value) return;
	this.value = value;
	this.iconNode.className = value ? "icon stop" : "icon play";
	this.module.terminal.notifier.show(value ? "play" : "stop");
}

ActionStartStop.prototype.getValue = function() {
	return this.value;
}

