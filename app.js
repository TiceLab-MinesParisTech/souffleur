#!/usr/bin/nodejs

var fs = require('fs');
const path = require('path');
var Express = require('express');
var Recorder = require("./lib/recorder");
var PrompterModule = require("./lib/prompterModule");

var Server = function() {
	this.config = {
		"filesdir": __dirname + "/samples",
		"port": 8080,
		"user": null,
		"group": null,
		"host": "0.0.0.0"
	};

	this.tracks = null;
	this.app = new Express();
	this.server = require('http').createServer(this.app);
	this.io = require('socket.io')(this.server, {
		path: '/socket.io',
		serveClient: true,
		pingInterval: 10000,
		pingTimeout: 5000,
		cookie: false
	});

	this.recorder = new Recorder();
	this.modules = [new PrompterModule(this)];
};

Server.prototype.help = function() {
	console.log("app.js [args]");
	console.log("\t-U<user>\tChange system user");
	console.log("\t-G<user>\tChange system group");
	console.log("\t-P<port>\tSet listening port. Default port is: " + this.config.port);
	console.log("\t-H<host>\tSet listening host. Default host is: " + this.config.host);
	console.log("\t-F<filesdir>\tSet files directory. (default is: “" + this.config.filesdir + "”)");
	console.log("\t+Hyperdeck:<host>:<name>:<source>\tAdd HyperDeck. Ex: +H:192.168.153.50:HyperDeck\\ Mini\\ 1:Cam1");
};

Server.prototype.parseArgs = function(argv) {
	for (var i = 1; i < argv.length; i++) {
		var arg = argv[i];
		if (arg.substr(0, 2) == "-P") this.config.port = arg.substr(2);
		if (arg.substr(0, 2) == "-H") this.config.host = arg.substr(2);
		if (arg.substr(0, 2) == "-U") this.config.user = arg.substr(2);
		if (arg.substr(0, 2) == "-G") this.config.group = arg.substr(2);
		if (arg.substr(0, 2) == "-F") this.config.filesdir = arg.substr(2);
		if (arg.substr(0, 11) == "+Hyperdeck:") {
			var cols = arg.substr(11).split(":");
			if (cols.length != 3) return false;
			this.recorder.add(cols[0], cols[1], cols[2]);
		}
		if (arg == "-h" || arg == "--help") {
			this.help();
			return false;
		}
	}
	return true;
};


Server.prototype.saveFile = function(filename, content, fct) {
	var path_ = path.join(this.config.filesdir, filename);
    fs.writeFile(path_, content, fct);
}

Server.prototype.isHiddenDirectory = function(dir) {
	var realpath = fs.realpathSync(path.join(this.config.filesdir, dir));
	return fs.existsSync(realpath + ".txt");
}

Server.prototype.filesList = function(dir) {
	var realpath = fs.realpathSync(path.join(this.config.filesdir, dir));
	var list = fs.readdirSync(realpath);
	var result = [];
	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		if (item.substr(0, 1) != ".") {
			var itemPath = path.join(dir, item);
			var stat = fs.lstatSync(path.join(this.config.filesdir, itemPath));
			if (stat.isDirectory() || stat.isSymbolicLink()) {
				if (!this.isHiddenDirectory(itemPath)) {
					result.push({
						"type": "dir",
						"name": item,
						"path": itemPath,
						"content": this.filesList(itemPath)
					});
				}
			}
			else {
				result.push({
					"type": "file",
					"name": item,
					"path": itemPath
				});
			}
		}
	}	
	return result;
};

Server.prototype.init = function() {
	var self = this;

	this.app.use('/', Express.static(__dirname + "/public", {"index": "index.html"}));

	this.app.get('/clients', function(req, res) {
		var idList = [];
		for (id in self.io.sockets.connected) {
			var socket = self.io.sockets.connected[id];
			idList.push({
				"socketid": socket.id,
				"data": socket.data
			});
		}
		res.append("Cache-Control", "no-cache");
		res.json(idList);
	});

	this.app.use('/files/', Express.static(this.config.filesdir));
	this.app.get('/files', function (req, res) {
		var files = self.filesList("");
		res.append("Cache-Control", "no-cache");
		res.json(files);

	});

	this.app.put('/files/*', function(req, res) {
		var filename = req.path.substr(7);
		var content = '';

		req.on('data', function(data) {
			content += data.toString();
		});

		req.on('end', function() {
		self.saveFile(filename, content, function(err) {
		console.log("write file", filename, err ? "error" : "ok");
				res.json({
					"err": err ? err.message : null
				});
  			});
  		});
 	});

	this.app.get('/tracks', function (req, res) {
		res.json(self.tracks);
	});

	this.recorder.onChangeStatus = function(status) {
		console.log("recorder::status", JSON.stringify(status));
		self.io.emit('recorder::status', status);
	};

	this.recorder.onChangeState = function(state) {
		console.log("recorder::state", JSON.stringify(state));
		self.io.emit('recorder::state', state);
	};

	this.io.on('connection', function(socket) {
		self.onConnect(socket);
	});
};

Server.prototype.onConnect = function(socket) {
	var self = this;

	console.log("connexion #" + socket.id);

	socket.data = {};
	socket.emit('register', socket.id);
	socket.emit("recorder::status", this.recorder.getStatus());

	socket.on('sendto', function(args) {
		var socketid = args.socketid;
		var eventName = args.eventName;
		var args = args.args;
		console.log("sendto #" + socketid + " " + eventName + " " + JSON.stringify(args));
		if (socketid in self.io.sockets.connected) self.io.sockets.connected[socketid].emit(eventName, args);
	});

	socket.on('client::set', function(arr) {
		console.log("client::set", JSON.stringify(arr));
		socket.data = arr;
	});

	socket.on('client::settings::set', function(arr) {
		console.log("client::settings::set", JSON.stringify(arr));
		socket.data.settings = arr;
	});

	socket.on('client::settings::param::set', function(arr) {
		console.log("client::settings::param::set", arr.socketid + ":" + arr.key + " " + JSON.stringify(arr.value));
		self.io.emit("client::settings::param::set", arr);
	});
	
	socket.on('disconnect', function(){
		console.log("deconnexion d’un client");
	});

	socket.on('recorder::start', function(name) {
		console.log("recorder::start", name ? name : "-");
		if (name)
			self.recorder.recordName(name);
		else
			self.recorder.record();
	});

	socket.on('recorder::stop', function() {
		console.log("recorder::stop");
		self.recorder.stop();
	});

	socket.on('recorder::preview', function(state) {
		console.log("recorder::preview", JSON.stringify(state));
		self.recorder.previewEnable(state);
	});

	socket.on('dmx::faders::set', function(arr) {
		console.log("dmx::faders::set", JSON.stringify(arr));
		self.io.emit('dmx::faders::set', arr);
	});

	for (var i = 0; i < this.modules.length; i++) {
		this.modules[i].bindEvents(socket);
	};
};

Server.prototype.start = function() {
	var self = this;
	console.log("Starting server on port", this.config.port);
	if (this.config.user) console.log("user:", this.config.user);
	if (this.config.group) console.log("group:", this.config.group);

	this.recorder.init();

	this.server.listen(this.config.port, this.config.host, function(){
		if (self.config.group) process.setgid(self.config.group);
		if (self.config.user) process.setuid(self.config.user);
	});
};

var server = new Server();
if (server.parseArgs(process.argv)) {
	server.init();
	server.start();
}


