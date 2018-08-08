var ToolAbout = function() {
	this.node = document.createElement("div");
	this.button = document.createElement("button");
	this.popup = document.createElement("div");
	this.version = "0.2";
	this.init();
};

ToolAbout.prototype.init = function() {
	var self = this;
	
	this.node.className = "toolAbout";
	
	this.button.className = "toolButton";
	this.button.appendChild(document.createTextNode("About"));
	this.button.onclick = function() { self.switchVisibility() };
	this.node.appendChild(this.button);

	this.popup.className = "toolbarPopup";
	this.node.appendChild(this.popup);

	var h1 = document.createElement("h1");
	h1.appendChild(document.createTextNode("Souffleur"));
	this.popup.appendChild(h1);

	var h2 = document.createElement("h2");
	h2.appendChild(document.createTextNode("An Open-Source and Innovative Teleprompter Solution"));
	//this.popup.appendChild(h2);
	
	var version = document.createElement("div");
	version.appendChild(document.createTextNode("version: " + this.version));
	version.className = "version";
	this.popup.appendChild(version);

	var more = document.createElement("div");
	more.appendChild(document.createTextNode("learn more at:"));
	this.popup.appendChild(more);

	var url = document.createElement("div");
	url.appendChild(document.createTextNode("http://tice-lab.mines-paristech.fr"));
	this.popup.appendChild(url);

	this.setVisibility(false);
};


ToolAbout.prototype.setVisibility = function(value) {
	this.popup.style.display = value ? "" : "none";
};

ToolAbout.prototype.getVisibility = function(value) {
	return this.popup.style.display == "" ? true : false;
};

ToolAbout.prototype.switchVisibility = function() {
	this.setVisibility(!this.getVisibility());
};

