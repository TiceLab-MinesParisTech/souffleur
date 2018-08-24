const fs = require('fs');
const Dmx = require("./simple-dmx/simple-dmx");

var ModuleDmx = function(server) {
	this.server = server;
	this.controls = {};
	this.conf = {};
	this.device = null;
};

ModuleDmx.prototype.loadConfFile = function(filename) {
	var data = fs.readFileSync(filename);  
	this.conf = JSON.parse(data);  	
};

ModuleDmx.prototype.load = function(filename) {
	var self = this;
	
	this.loadConfFile(filename);

	this.mapItems(this.conf.faders);

	this.device = new (Dmx(this.conf.driver))(this.conf.device_id);
	this.device.open();
	this.device.on("open", function() { self.emitConnected(true); } );
	this.device.on("close", function() { self.emitConnected(false); } );

	if (this.server.settings.isOpen()) {
		this.server.settings.useTable("dmx", function() {
			self.loadSettingsProfile("default");
		});
	}
};

ModuleDmx.prototype.emitConnected = function(value) {
	console.log("dmx::connected", value);
	this.server.io.emit("dmx::connected", value);
};

ModuleDmx.prototype.loadProfile = function(arr) {
	for (ref in arr) {
		this.setControl(ref, arr[ref]);
	}
};

ModuleDmx.prototype.loadSettingsProfile = function(name) {
	var self = this;

	if (!this.server.settings.isOpen())
		return;
		
	this.server.settings.get("dmx", name, function(value) {
		if (value) {
			console.log("value", value);
			self.loadProfile(JSON.parse(value));
		}
	});
};

ModuleDmx.prototype.saveSettingsProfile = function(name) {
	if (!this.server.settings.isOpen())
		return;

	var settings = {};
	for (ref in this.controls) {
		settings[ref] = this.controls[ref].value;
	}
	this.server.settings.set("dmx", name, JSON.stringify(settings));
};

ModuleDmx.prototype.resolveChannel = function(channel) {
	if (typeof channel == "string") {
		return this.conf.channels[channel];
	}
	return channel;
};

ModuleDmx.prototype.resolveChannels = function(list) {
	result = [];
	for (var i = 0; i < list.length; i++) {
		result.push(this.resolveChannel(list[i]));
	}
	return result;
};

ModuleDmx.prototype.mapControl = function(item) {
	this.controls[item.ref] = {
		"min": item.min ? item.min : 0,
		"max": item.max ? item.max : 100,		
		"channels": this.resolveChannels(item.channels),
		"value": item.min ? item.min : 0
	};
};

ModuleDmx.prototype.mapGroup = function(item) {
	this.mapItems(item.faders);	
};

ModuleDmx.prototype.mapItem = function(item) {
	if (item.type == "group") {
		this.mapGroup(item);
		return;
	}
	this.mapControl(item);
};

ModuleDmx.prototype.mapItems = function(items) {
	for (var i = 0; i < items.length; i++) {
		this.mapItem(items[i]);
	}
};

ModuleDmx.prototype.bind = function(socket) {
	var self = this;

	socket.on('dmx::controls::set', function(arr) {
		self.setControl(arr.ref, parseInt(arr.value), socket);
	});

	socket.on('dmx::save', function(name) {
		self.saveSettingsProfile(name ? name : "default");
	});

	socket.on('dmx::connect', function() {
		self.onConnect();
	});

	this.join(socket);
};

ModuleDmx.prototype.join = function(socket) {
	this.emitConnected(this.device.isOpen());
	if (this.conf) socket.emit("dmx::controls::configure", this.conf);
	for (ref in this.controls) {
		var value = this.controls[ref].value;
		this.emitControl(ref, value);
	}
};

ModuleDmx.prototype.setDmxChannels = function(channels, value) {
	var arr = {};
	for (var i = 0; i < channels.length; i++) {
		arr[channels[i]] = value;
	}
	console.log(channels);
	this.device.setChannels(arr);
};

ModuleDmx.prototype.onConnect = function() {
	var self = this;
	this.device.open(function(err) {
		if (err) self.emitConnected(false);
	});
};

ModuleDmx.prototype.emitFrom = function(name, args, from) {
	if (from) {
		from.broadcast.emit(name, args);
	} else {
		this.server.io.emit(name, args);
	}
};

ModuleDmx.prototype.emitControl = function(ref, value, from) {
	this.emitFrom('dmx::controls::set', {"ref": ref, "value": value});
};

ModuleDmx.prototype.setControl = function(ref, value, socket) {
	this.emitControl(ref, value, socket);
	if (ref in this.controls) {
		var control =  this.controls[ref];
		control.value = value;
		var dmxValue = Math.floor((parseInt(value) - control.min) / (control.max - control.min) * 255);
		this.setDmxChannels(control.channels, dmxValue);
	}
};

module.exports = ModuleDmx;
