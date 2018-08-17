var Fader = function(module, ref, title, min, max, step, marks, format, channels) {
	this.module = module;
	this.ref = ref;
	this.min = min;
	this.max = max;
	this.format = format;
	this.updateTimeout = null;

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
	this.initValue(min);
};

Fader.prototype.emitSetValue = function(value) {
	this.module.emitSetValue(this.ref, value);
};

Fader.prototype.showValue = function(value) {
	this.display.firstChild.nodeValue = this.formatValue(value);
}

Fader.prototype.onSetValue = function(value) {
	this.showValue(value);
	this.input.value = value;
};

Fader.prototype.setValue = function(value) {
	this.input.value = value;
	this.onChangeValue(value);
};

Fader.prototype.initValue = function(value) {
	this.input.value = value;
	this.showValue(value);
};

Fader.prototype.onChangeValue = function(value) {
	this.emitSetValue(value);
	this.showValue(value);
};

Fader.prototype.onchange = function(e) {
	this.onChangeValue(this.input.value);
};

var FaderMark = function(parent, value) {
	this.node = document.createElement("button");
	this.node.appendChild(document.createTextNode(parent.formatValue(value)));
	this.node.addEventListener("click", function() { parent.setValue(value); return false; });
};
