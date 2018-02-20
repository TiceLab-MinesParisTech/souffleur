var Server = function() {
	this.socket = io.connect('/');
	this.socketid = null;
	this.terminal = null;
}

Server.prototype.mapping =  { 
	"client::settings::param::set": "onSettingsParam",
	"play": "onPlay",
	"stop": "onStop",
	"speed::set": "onSetSpeed",
	"tracks::load": "onLoadTracks",
	"notify": "onNotify",
	"id": "onId",
	"register": "onRegister",
	"recorder::status": "onRecorderStatus",
	"recorder::state": "onRecorderState"
};

Server.prototype.on = function(name, args) {
	if (!(name in this.mapping))
		return false;
		
	var fct = this.mapping[name];
	console.log(name, fct);
	this[fct](args);
	return true;
};

Server.prototype.attachTerminal = function(terminal) {
	var self = this;
	this.terminal = terminal;
	
	function bind(name, fct) {
		self.socket.on(name, function(args) {
			self[fct](args);
		});
	}

	for (name in this.mapping) {
		bind(name, this.mapping[name]);
	};
};

Server.prototype.loadUrl = function(url, fct, mimeType) {
	var xhttp = new XMLHttpRequest();
	if (mimeType) xhttp.overrideMimeType(mimeType);
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200 || this.status == 0)
				fct(this.responseText);
			else 
				console.log("HTTP Error:", this.status);
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

Server.prototype.loadJSON = function(url, fct) {
	this.loadUrl(url, function(text) {
		var arr = JSON.parse(text);
		if (arr) fct(arr);
	}, "application/json");
};

Server.prototype.loadFile = function(filename, fct) {
	this.loadUrl("files/" + filename, fct);
};

Server.prototype.loadFilesList = function(fct) {
	this.loadJSON("files", fct);
};

Server.prototype.loadCurrentTracks = function(fct) {
	this.loadJSON("tracks", fct);
};

Server.prototype.loadClientsList = function(fct) {
	var self = this;
	this.loadJSON("/clients", function(list) {
		for (var i = 0; i < list.length; i++) {
			if (list[i].socketid == self.socketid)
				list[i].socketid = null;
		}
		fct(list);
	});
};

Server.prototype.emit = function(name, args) {
	this.socket.emit(name, args);
};

Server.prototype.emitLoadTracks = function(tracks) {
	this.emit('tracks::load', tracks);
};

Server.prototype.onLoadTracks = function(tracks) {
	this.terminal.loadTracks(tracks);
};

Server.prototype.emitSetSpeed = function(value) {
	this.emit('speed::set', value);
};

Server.prototype.onSetSpeed = function(value) {
	this.terminal.toolbar.toolSpeed.setSpeed(value);
};

Server.prototype.emitPlay = function(position, speed) {
	this.emit('play', {"position": position, "speed": speed});
};

Server.prototype.onPlay = function(args) {
	this.terminal.play(args.position, args.speed);
};

Server.prototype.emitStop = function(position) {
	this.emit('stop', position);
};

Server.prototype.onStop = function(position) {
	this.terminal.stop(position);
};

Server.prototype.emitRecorderStart = function(name) {
	this.emit('recorder::start', name ? name : null);
};

Server.prototype.emitRecorderStop = function() {
	this.emit('recorder::stop');
};

Server.prototype.emitRecorderPreview = function(state) {
	this.emit('recorder::preview', state);
};

Server.prototype.emitSettings = function(arr) {
	this.emit("client::settings::set", arr);
};

Server.prototype.emitSettingsParam = function(socketid, key, value) {
	this.emit("client::settings::param::set", {"socketid": socketid ? socketid : this.socketid, "key": key, "value": value});
};

Server.prototype.onSettingsParam = function(args) {
	this.terminal.setSettingsParam(args.socketid == this.socketid ? null : args.socketid, args.key, args.value);
};

Server.prototype.emitSendTo = function(socketid, eventName, args) {
	this.emit("sendto", {
		"socketid":  socketid ? socketid : this.socketid,
		"eventName": eventName,
		"args": args
	});
};

Server.prototype.emitNotify = function(socketid, text) {
	this.emitSendTo(socketid, "notify", text);
};

Server.prototype.onNotify = function(text) {
	this.terminal.notifier.show(text);
};

Server.prototype.emitId = function(socketid) {
	this.emitSendTo(socketid, "id");
};

Server.prototype.emitClientSet = function() {
	this.emit("client::set", this.terminal.getData());
};

Server.prototype.onRegister = function(socketid) {
	this.socketid = socketid;
	this.emitClientSet();
};

Server.prototype.onRecorderStatus = function(args) {
	this.terminal.setRecorderStatus(args);
};

Server.prototype.onRecorderState = function(value) {
	this.terminal.setRecorderState(value);
};

Server.prototype.onId = function() {
	this.terminal.id();
};
