var ToolRecorder = function(terminal) {
	this.terminal = terminal;

	this.node = document.createElement("div");
	this.nodeStart = document.createElement("button");
	this.nodeStop = document.createElement("button");
	this.nodePreview = document.createElement("button");
	this.nodeRecorders = document.createElement("div");

	this.state = undefined;
	this.enabled = null;
	this.startDuration = 3000;
	this.startTimeout = null;
	this.stopDuration = 5000;
	this.stopTimeout = null;
	this.active = false;
	this.init();
}

ToolRecorder.prototype.init = function() {
	var self = this;

	this.node.className = "toolRecorder";

	this.node.appendChild(this.nodeRecorders);
	this.nodeRecorders.className = "recorders";

	var icon = document.createElement("div");
	icon.className = "icon recordPreview";
	this.nodePreview.appendChild(icon);
	this.nodePreview.onclick = function(e) { self.preview(); return false; };
	//this.node.appendChild(this.nodePreview);

	var icon = document.createElement("div");
	icon.className = "icon recordStart";
	this.nodeStart.appendChild(icon);
	this.nodeStart.onclick = function(e) { self.start(); return false; };
	this.node.appendChild(this.nodeStart);
	
	var icon = document.createElement("div");
	icon.className = "icon recordStop";
	this.nodeStop.appendChild(icon);
	this.nodeStop.onclick = function(e) { self.stop(); return false; };
	this.node.appendChild(this.nodeStop);

	this.setState(false);
	this.setEnabled(false);
};

ToolRecorder.prototype.showStatus = function(arr) {
	while (this.nodeRecorders.firstChild) this.nodeRecorders.removeChild(this.nodeRecorders.firstChild);
	
	this.setEnabled(arr.length > 0);

	for (var i = 0; i < arr.length; i++) {
		var status = arr[i];
		var div = document.createElement("div");
		div.className = "recorder" + (status ? " recording" : "");
		this.nodeRecorders.appendChild(div);
	}
};

ToolRecorder.prototype.clearTimeouts = function() {
	if (this.startTimeout) clearTimeout(this.startTimeout);
	if (this.stopTimeout) clearTimeout(this.stopTimeout);
};

ToolRecorder.prototype.waitForStart = function() {
	var self = this;
	this.clearTimeouts();
	this.startTimeout = setTimeout(function() { self.terminal.emitPlay(); }, this.startDuration);
};

ToolRecorder.prototype.setPlaying = function(playing) {
	if (!this.active) return;
	
	this.clearTimeouts();

	if (!playing && this.state) {
		var self = this;
		this.stopTimeout = setTimeout(function() { self.terminal.emitRecorderStop() }, this.stopDuration);
	}
};

ToolRecorder.prototype.stop = function() {
	this.clearTimeouts();
	this.terminal.emitRecorderStop();
}

ToolRecorder.prototype.start = function() {
	this.clearTimeouts();
	this.active = true;
	this.terminal.emitRecorderStart();
};

ToolRecorder.prototype.startStop = function() {
	if (!this.state) {
		this.start();
	}
	else {
		this.stop();
	}
}

ToolRecorder.prototype.preview = function() {
	this.terminal.client.emitRecorderPreview(true);
}

ToolRecorder.prototype.setState = function(value) {
	var previousState = this.state;
	if (this.state === value) return;
	this.state = value;
	
	this.nodeStart.style.display = this.state === true ? "none" : "";
	this.nodeStop.style.display = this.state === false ? "none" : "";
	this.terminal.tally.set(this.state);

	if (this.state != undefined) this.terminal.notifier.show(value ? "record" : "stop recording");

	if (this.active) {
		if (this.state) {
			this.waitForStart();
		}
		else if (previousState) {
			this.terminal.emitStop();
			this.active = false;
		}
	}
};

ToolRecorder.prototype.getState = function() {
	return this.state;
};

ToolRecorder.prototype.setEnabled = function(value) {
	this.enabled = value;
	this.node.style.display = value ? "" : "none";
};

