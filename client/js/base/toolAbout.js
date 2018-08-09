var ToolAbout = function() {
	this.node = document.createElement("div");
	this.version = "0.2";
	this.init();
};

ToolAbout.prototype.init = function() {
	var self = this;
	
	this.node.className = "toolAbout";
	
	var h1 = document.createElement("h1");
	h1.appendChild(document.createTextNode("Souffleur"));
	this.node.appendChild(h1);

	var h2 = document.createElement("h2");
	h2.appendChild(document.createTextNode("An Open-Source and Innovative Teleprompter Solution"));
	
	var version = document.createElement("div");
	version.appendChild(document.createTextNode("version: " + this.version));
	version.className = "version";
	this.node.appendChild(version);

	var more = document.createElement("div");
	more.appendChild(document.createTextNode("learn more at:"));
	this.node.appendChild(more);

	var url = document.createElement("div");
	url.appendChild(document.createTextNode("http://tice-lab.mines-paristech.fr"));
	this.node.appendChild(url);
};


