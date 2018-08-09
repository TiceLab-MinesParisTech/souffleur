var Client = function(terminal) {
	this.socket = io.connect('/');
	this.socketid = null;
	this.terminal = terminal;
	
	this.init();
}

Client.prototype.init = function() {
	var self = this;

	this.on("client::settings::param::set", function(args) { self.onSettingsParam(args); });
	this.on("notify", function(args) { self.onNotify(args); });
	this.on("id", function(args) { self.onId(args); });
	this.on("register", function(args) { self.onRegister(args); });
	this.on("recorder::status", function(args) { self.onRecorderStatus(args); });
	this.on("recorder::state", function(args) { self.onRecorderState(args); });
};

Client.prototype.on = function(name, args) {
	this.socket.on(name, args);
};

Client.prototype.loadUrl = function(url, fct, method, params) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200 || this.status == 0)
				fct(this.responseText);
			else 
				console.log("HTTP Error:", this.status);
		}
	};
	xhttp.open(method ? method : "GET", url, true);
	xhttp.send(params);
}

Client.prototype.loadJSON = function(url, fct, method, params) {
	this.loadUrl(url, function(text) {
		var arr = JSON.parse(text);
		if (arr) fct(arr);
	}, method, params);
};

Client.prototype.loadFile = function(filename, fct) {
	this.loadUrl("files/" + filename, fct);
};

Client.prototype.saveFile = function(filename, data, fct) {
	console.log("save file...");
	this.loadJSON("files/" + filename, fct, "PUT", data);
};

Client.prototype.loadFilesList = function(fct) {
	this.loadJSON("files", fct);
};

Client.prototype.loadCurrentTracks = function(fct) {
	this.loadJSON("tracks", fct);
};

Client.prototype.loadClientsList = function(fct) {
	var self = this;
	this.loadJSON("/clients", function(list) {
		for (var i = 0; i < list.length; i++) {
			if (list[i].socketid == self.socketid)
				list[i].socketid = null;
		}
		fct(list);
	});
};

Client.prototype.emit = function(name, args) {
	this.socket.emit(name, args);
};

Client.prototype.emitRecorderStart = function(name) {
	this.emit('recorder::start', name ? name : null);
};

Client.prototype.emitRecorderStop = function() {
	this.emit('recorder::stop');
};

Client.prototype.emitRecorderPreview = function(state) {
	this.emit('recorder::preview', state);
};

Client.prototype.emitSettings = function(arr) {
	this.emit("client::settings::set", arr);
};

Client.prototype.emitSettingsParam = function(socketid, key, value) {
	this.emit("client::settings::param::set", {"socketid": socketid ? socketid : this.socketid, "key": key, "value": value});
};

Client.prototype.onSettingsParam = function(args) {
	this.terminal.setSettingsParam(args.socketid == this.socketid ? null : args.socketid, args.key, args.value);
};

Client.prototype.emitSendTo = function(socketid, eventName, args) {
	this.emit("sendto", {
		"socketid":  socketid ? socketid : this.socketid,
		"eventName": eventName,
		"args": args
	});
};

Client.prototype.emitNotify = function(socketid, text) {
	this.emitSendTo(socketid, "notify", text);
};

Client.prototype.onNotify = function(text) {
	this.terminal.notifier.show(text);
};

Client.prototype.emitId = function(socketid) {
	this.emitSendTo(socketid, "id");
};

Client.prototype.emitClientSet = function() {
	this.emit("client::set", this.terminal.getData());
};

Client.prototype.onRegister = function(socketid) {
	this.socketid = socketid;
	this.emitClientSet();
};

Client.prototype.onRecorderStatus = function(args) {
	this.terminal.setRecorderStatus(args);
};

Client.prototype.onRecorderState = function(value) {
	this.terminal.setRecorderState(value);
};

Client.prototype.onId = function() {
	this.terminal.id();
};
