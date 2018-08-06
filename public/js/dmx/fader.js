var Fader = function(tool, ref, title, min, max, step, marks, format, channels) {
	this.tool = tool;
	this.ref = ref;
	this.min = min;
	this.max = max;
	this.format = format;
	
	this.node = document.createElement("div");
	this.label = document.createElement("div");
	this.display = document.createElement("div");
	this.input = document.createElement("input");
	this.channels = document.createElement("div");

	this.init(title, min, max, step, marks, channels);
};

Fader.prototype.formatValue = function(value) {
	return this.format ? this.format.replace("%d", value) : value;
};

Fader.prototype.init = function(title, min, max, step, marks, channels) {
	var self = this;
	this.node.className = "fader";

	this.label.appendChild(document.createTextNode(title));
	this.label.className = "label";
	this.node.appendChild(this.label);

	this.display.appendChild(document.createTextNode(""));
	this.display.className = "display";
	this.node.appendChild(this.display);
	
	this.input.setAttribute("type", "range");
	this.input.setAttribute("min", min);
	this.input.setAttribute("max", max);
	this.input.setAttribute("step", step);
	this.input.value = 0;
	this.input.addEventListener("input", function(e) { self.onchange(e) });

	this.node.appendChild(this.input);

	if (marks) {
		var container = document.createElement("div");
		this.node.appendChild(container);
		console.log(marks.length);
		for (var i = 0; i < marks.length; i++) {
			var mark = new FaderMark(this, marks[i]);
			container.appendChild(mark.node);
		}
	}

	this.channels.className = "channels";
	this.node.appendChild(this.channels);
	for (var i = 0; i < channels.length; i++) {
		var span = document.createElement("span");
		span.className = "channel";
		span.appendChild(document.createTextNode(channels[i]));
		this.channels.appendChild(span);
	}
	this.setValue(min);
};

Fader.prototype.emitValue = function(value) {
	this.tool.emitSetValue(this.ref, value);
};

Fader.prototype.setValue = function(value) {
	this.value = value;
	this.display.firstChild.nodeValue = this.formatValue(this.value);
	if (this.input.value != value) this.input.value = value;
};

Fader.prototype.onchange = function(e) {
	this.emitValue(this.input.value);
};

var FaderMark = function(parent, value) {
	this.node = document.createElement("button");
	this.node.appendChild(document.createTextNode(parent.formatValue(value)));
	this.node.addEventListener("click", function() { parent.emitValue(value) });
};
