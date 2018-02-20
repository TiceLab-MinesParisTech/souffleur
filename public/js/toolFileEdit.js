var ToolFileEdit = function(terminal, toolFile) {
	this.terminal = terminal;
	this.toolFile = toolFile;

	this.node = document.createElement("form");
	this.nodeTextarea = document.createElement("textarea");
	this.nodeOk = document.createElement("button");
	this.nodeClose = document.createElement("button");

	this.init();
}

ToolFileEdit.prototype.init = function() {
	var self = this;

	this.node.className = "toolFileEdit";
	this.node.appendChild(this.nodeTextarea);

	this.node.appendChild(this.nodeOk);
	this.nodeOk.appendChild(document.createTextNode("Ok"));
	this.nodeOk.onclick = function() { self.onOk(); return false; };

	this.node.appendChild(this.nodeClose);
	this.nodeClose.appendChild(document.createTextNode("Close"));
	this.nodeClose.onclick = function() { self.onClose(); return false; };

	this.setValue("#Lorem Ipsum\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et nulla luctus, euismod nisl vel, semper sapien. Morbi eget metus convallis, sollicitudin urna eu, molestie dolor. Morbi vel egestas eros, quis tempus mauris. Fusce ac nunc quis nunc auctor aliquet vel quis odio. Phasellus ornare tempor sapien, at tincidunt mi dictum pulvinar. Nunc risus purus, varius sed orci at, fermentum gravida lorem. Nullam non finibus orci. In urna turpis, aliquet vel metus id, eleifend varius orci. Fusce metus orci, interdum a congue fringilla, imperdiet et turpis.\n\nMorbi non urna nisi. Donec quis tristique urna. Nunc lorem est, varius sit amet congue in, efficitur at ex. Cras et porttitor ex. Quisque scelerisque eros non semper imperdiet. Ut lorem lacus, sodales quis hendrerit non, egestas at neque. Fusce at erat imperdiet, venenatis mi sed, interdum ex. Sed consequat mi sed risus feugiat, ac sagittis tortor malesuada. Pellentesque bibendum leo sed nibh congue tempor. Vestibulum auctor eros et metus accumsan, ut pellentesque leo tempor.");
}

ToolFileEdit.prototype.onOk = function() {
	this.toolFile.loadText(null, this.getValue());
};

ToolFileEdit.prototype.onClose = function() {
	this.toolFile.close();
};

ToolFileEdit.prototype.setValue = function(str) {
	this.nodeTextarea.value = str;
}

ToolFileEdit.prototype.getValue = function() {
	return this.nodeTextarea.value;
}

