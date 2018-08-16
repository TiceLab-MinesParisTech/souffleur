const fs = require('fs');
const Dmx = require("dmx");

var DmxModule = function(server) {
	this.server = server;
	this.mapping = {};
	this.conf = {};
	this.device = null;
};

DmxModule.prototype.loadConfFile = function(filename) {
	var data = fs.readFileSync(filename);  
	this.conf = JSON.parse(data);  	
};

DmxModule.prototype.load = function(filename) {
	this.loadConfFile(filename);
	this.updateConf();
	this.loadSettings();
};

DmxModule.prototype.loadSettings = function() {
	var self = this;
	this.server.settings.get("dmx", function(row) {
		if (row.key in self.mapping) {
			self.mapping[row.key].value = row.value;
		}
	});
};

DmxModule.prototype.saveFader = function(ref, value) {
	console.log("save", ref, value);
	var stmt = this.server.settings.db.prepare("UPDATE dmx SET value = ? WHERE key = ?;");
	stmt.run([value, ref]);
};

DmxModule.prototype.updateConf = function() {
	this.mapItems(this.conf.faders);

	this.device = new Dmx();
	this.universe = this.device.addUniverse("output", this.conf.driver, this.conf.device_id);
};

DmxModule.prototype.resolveChannel = function(channel) {
	if (typeof channel == "string") {
		return this.conf.channels[channel];
	}
	return channel;
};

DmxModule.prototype.resolveChannels = function(list) {
	result = [];
	for (var i = 0; i < list.length; i++) {
		result.push(this.resolveChannel(list[i]));
	}
	return result;
};

DmxModule.prototype.mapFader = function(item) {
	this.mapping[item.ref] = {
		"min": item.min ? item.min : 0,
		"max": item.max ? item.max : 100,		
		"channels": this.resolveChannels(item.channels),
		"value": 0
	};
};

DmxModule.prototype.mapGroup = function(item) {
	this.mapItems(item.faders);	
};

DmxModule.prototype.mapItem = function(item) {
	if (item.type == "group") {
		this.mapGroup(item);
		return;
	}
	this.mapFader(item);
};

DmxModule.prototype.mapItems = function(items) {
	for (var i = 0; i < items.length; i++) {
		this.mapItem(items[i]);
	}
};

DmxModule.prototype.bindEvents = function(socket) {
	var self = this;

	socket.on('dmx::faders::set', function(arr) {
		self.setFader(arr.ref, arr.value, socket);
	});

	this.join(socket);
};

DmxModule.prototype.join = function(socket) {
	if (this.conf) socket.emit("dmx::faders::configure", this.conf);
	for (ref in this.mapping) {
		var value = this.mapping[ref].value;
		this.emitFader(ref, value);
	}
};

DmxModule.prototype.setChannels = function(channels, value) {
	var arr = {};
	for (var i = 0; i < channels.length; i++) {
		arr[channels[i]] = value;
	}
	this.universe.update(arr);
};

DmxModule.prototype.emitFader = function(ref, value, socket) {
	var args = {"ref": ref, "value": value};
	if (socket) {
		socket.broadcast.emit('dmx::faders::set', args);
	} else {
		this.server.io.emit('dmx::faders::set', args);
	}
};

DmxModule.prototype.setFader = function(ref, value, socket) {
	this.emitFader(ref, value, socket);
	if (ref in this.mapping) {
		var mapping =  this.mapping[ref];
		mapping.value = value;
		var dmxValue = Math.floor((parseInt(value) - mapping.min) / (mapping.max - mapping.min) * 255);
		this.setChannels(mapping.channels, dmxValue);
		this.saveFader(ref, value);
	}
};

module.exports = DmxModule;
