var SettingToolSize = function(settings, param) {
	SettingTool.call(this, settings, param);
	
	this.buttonMore = document.createElement("button");
	this.buttonLess = document.createElement("button");
	this.span = document.createElement("span");
	this.node = document.createElement("div");
	this.value = null;

	this.init();
};

SettingToolSize.prototype = Object.create(SettingTool.prototype);

SettingToolSize.prototype.inc = function(steps) {
	this.set(this.param.inc(this.value, steps));
};

SettingToolSize.prototype.show = function(value) {
	this.value = value;
	this.span.firstChild.nodeValue = this.param.render(value);
};

SettingToolSize.prototype.init = function() {
	var self = this;

	this.node.className = "settingToolSize";
	this.buttonMore.id = this.getId();

	this.buttonLess.appendChild(document.createTextNode("−"));
	this.node.appendChild(this.buttonLess);

	this.node.appendChild(this.span);
	this.span.appendChild(document.createTextNode(""));

	this.buttonMore.appendChild(document.createTextNode("+"));
	this.node.appendChild(this.buttonMore);

	this.buttonMore.onclick = function() { self.inc(1); };
	this.buttonLess.onclick = function() { self.inc(-1); };

	this.show(this.get());
};
