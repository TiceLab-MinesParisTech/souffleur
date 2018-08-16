const fs = require('fs');
const Dmx = require("dmx");

var DmxModule = function(server) {
	this.server = server;
	this.mapping = {};
	this.conf = {};
	this.dmx = null;
};

DmxModule.prototype.loadConfFile = function(filename) {
	var data = fs.readFileSync(filename);  
	this.conf = JSON.parse(data);  	
	console.log(this.conf);
	this.updateConf();
};

DmxModule.prototype.updateConf = function() {
	this.mapItems(this.conf.faders);

	this.dmx = new Dmx();
	this.universe = this.dmx.addUniverse("output", this.conf.driver, this.conf.device_id);
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
		"channels": this.resolveChannels(item.channels)
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
		//console.log("dmx::faders::set", JSON.stringify(arr));
		//self.server.io.emit('dmx::faders::set', arr);
		socket.broadcast.emit('dmx::faders::set', arr);
		self.setFader(arr.ref, arr.value);
	});


	socket.emit("dmx::faders::configure", this.conf);
};

DmxModule.prototype.setChannels = function(channels, value) {
	var arr = {};
	for (var i = 0; i < channels.length; i++) {
		arr[channels[i]] = value;
	}
	this.universe.update(arr);
	console.log(value);
};

DmxModule.prototype.setFader = function(ref, value) {
	if (ref in this.mapping) {
		var mapping =  this.mapping[ref];
		var value = Math.floor((parseInt(value) - mapping.min) / (mapping.max - mapping.min) * 255);
		this.setChannels(mapping.channels, value);
	}
};

module.exports = DmxModule;
