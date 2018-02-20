var hyperdeck = require("./hyperdeck");

var Recorder = function() {
	this.hyperdecks = new hyperdeck.Clients();
};

Recorder.prototype.add = function(host, name, src) {
	console.log("Using hyperdeck:", host, "“" + name + "”", "“" + src + "”");
	this.hyperdecks.add(host, 9993, {"name": name, "src": src});
}; 

Recorder.prototype.getStatus = function() {
	var arr = [];
	for (var i = 0; i < this.hyperdecks.count(); i++) {
		var client = this.hyperdecks.getClient(i);
		arr.push(client.state.transport.status == "record");
	}
	return arr;
};

Recorder.prototype.getState = function(status) {
	if (status.length < 1) return false;
	var result = status[0];

	for (var i = 1; i < status.length; i++) {
		if (status[i] != result)
			return undefined;
	}
	return result;
};

Recorder.prototype.emitStatus = function() {
	var status = this.getStatus();
	if ("onChangeStatus" in this) this.onChangeStatus.call(this, status);

	var state = this.getState(status);
	if ("onChangeState" in this) this.onChangeState.call(this, state);
};

Recorder.prototype.init = function(cb) {
	var self = this;
	this.hyperdecks.on("transportInfo", function(transport) {
		self.emitStatus();
	});

	this.hyperdecks.connect(function() {
		console.log("Connected");
		self.hyperdecks.notifyAll(function() { 
			console.log("Ready");
			self.emitStatus();
			if (cb) cb.call(this);
		});
	});
};

Recorder.prototype.play = function() {
	this.hyperdecks.play();
};

Recorder.prototype.record = function() {
	this.hyperdecks.record();
};

Recorder.prototype.previewEnable = function(state) {
	this.hyperdecks.previewEnable(state);
};

Recorder.prototype.recordName = function(name) {
	this.hyperdecks.recordName(name);
};

Recorder.prototype.stop = function() {
	this.hyperdecks.stop();
};

module.exports = Recorder;
