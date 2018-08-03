var Fader = function(ref, title, min, max, step, marks) {
	this.ref = ref;
	this.min = min;
	this.max = max;
	
	this.node = document.createElement("div");
	this.label = document.createElement("div");
	this.display = document.createElement("div");
	this.input = document.createElement("input");

	this.init(title, min, max, step, marks);
};

Fader.prototype.init = function(title, min, max, step, marks) {
	var self = this;
	this.node.className = "fader";

	this.label.appendChild(document.createTextNode(title));
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
		
	this.setValue(min);
};

Fader.prototype.setValue = function(value) {
	this.value = value;
	this.display.firstChild.nodeValue = this.value;
	if (this.input.value != value) this.input.value = value;
};

Fader.prototype.onchange = function(e) {
	this.setValue(this.input.value);
};

var FaderMark = function(parent, value) {
	this.node = document.createElement("button");
	this.node.appendChild(document.createTextNode(value));
	this.node.addEventListener("click", function() { parent.setValue(value) });
};
