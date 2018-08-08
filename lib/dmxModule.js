var DmxModule = function(server) {
	this.server = server;
	this.mapping = {};
	
	this.conf = {
		"driver": "enttec-usb-dmx-pro",
		"device_id": "/dev/serial/by-path/pci-0000:00:14.0-usb-0:1:1.0-port0",
		"faders": [
			{
				"type": "group",
				"title": "Faces",
				"faders": [
					{
						"ref": "front.left", 
						"title": "Gauche",
						"channels": ["front.left.power"]
					},
					{
						"ref": "top.left",
						"title": "Haut Gauche",
						"channels": ["top.left1.power", "top.left2.power"]
					},
					{
						"ref": "top.right", 
						"title": "Haut Droite",
						"channels": ["top.right1.power", "top.right2.power"]
					},
					{
						"ref": "front.right",
						"title": "Droite",
						"channels": ["front.right.power"]
					}
				]
			},
			{
				"type": "group",
				"title": "Fond",
				"faders": [
					{
						"ref": "back.left", 
						"title": "Gauche",
						"channels": ["back.left.power"]
					},
					{
						"ref": "back.right",
						"title": "Droite",
						"channels": ["back.right.power"]
					}
				]
			},
			{
				"ref": "temp",
				"format": "%d °K",
				"title": "Température Panels",
				"min": 2700, 
				"max": 6500, 
				"step": 100,
				"marks": [3200, 5600],
				"channels": ["front.left.temp", "top.left1.temp", "top.left2.temp", "top.right1.temp", "top.right2.temp", "front.right.temp", "back.left.temp", "back.right.temp"]
			},
			{
				"type": "group",
				"title": "Contres",
				"faders": [
					{
						"ref": "rear.left", 
						"title": "Gauche",
						"channels": ["rear.left.power"]
					},
					{
						"ref": "rear.right",
						"title": "Droite",
						"channels": ["rear.right.power"]
					},
					{
						"ref": "rear.temp",
						"format": "%d °K",
						"title": "Température",
						"min": 3200, 
						"max": 5600, 
						"step": 100,
						"channels": ["rear.left.temp", "rear.right.temp"]
					}
				]
			}
		],
		"channels": {
			"top.right1.temp": 1,
			"top.right1.power": 2,
			"top.right2.temp": 3,
			"top.right2.power": 4,
			"top.left1.temp": 5,
			"top.left1.power": 6,
			"top.left2.temp": 7,
			"top.left2.power": 8,

			"front.right.temp": 19,
			"front.right.power": 20,
			"front.left.temp": 17,
			"front.left.power": 18,
			
			"back.right.temp": 13,
			"back.right.power": 14,
			"back.left.temp": 15,
			"back.left.power": 16,

			"rear.right.power": 9,
			"rear.right.temp": 10,
			"rear.left.power": 11,
			"rear.left.temp": 12
		}
	};
	
	var Dmx = require("dmx");
	this.dmx = new Dmx();
	this.universe = this.dmx.addUniverse("output", this.conf.driver, this.conf.device_id);

	this.init();
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

DmxModule.prototype.init = function() {
	this.mapItems(this.conf.faders);
	console.log("mapping DMX", this.mapping);
};

DmxModule.prototype.bindEvents = function(socket) {
	var self = this;

	socket.on('dmx::faders::set', function(arr) {
		console.log("dmx::faders::set", JSON.stringify(arr));
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
