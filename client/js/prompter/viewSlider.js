var ViewSlider = function(terminal) {
	this.terminal = terminal;
	
	this.node = document.createElement("div");
	this.parts = new ViewSliderParts();
	this.output = new ViewSliderOutput();
	this.pager = new ViewSliderPager(this);
	this.init();
}

ViewSlider.prototype.init = function() {
	this.node.className = "viewSlider";
	this.node.appendChild(this.output.node);
	this.node.appendChild(this.pager.node);
};

ViewSlider.prototype.setSize = function(value) {
	this.output.setSize(value);
};

ViewSlider.prototype.load = function(data) {
	this.parts.clear();
	for (var i = 0; i < data.length; i++) {
		this.parts.push(new ViewSliderPart(data[i]));
	};

	this.pager.setSize(this.parts.count());
};

ViewSlider.prototype.setPartId = function(id) {
	this.output.setPart(this.parts.items[id]);
}

ViewSlider.prototype.goto = function() {
	var position = this.getPosition();
	this.terminal.emitStop(position);
};

ViewSlider.prototype.getDuration = function() {
	return this.parts.getDuration();
};

ViewSlider.prototype.getPosition = function() {
	return this.parts.getPositionFromPart(this.output.getPart());
};

ViewSlider.prototype.setPosition = function(position) {
	var partid = this.parts.getPartId(this.parts.getPartFromPosition(position));
	this.pager.setPage(partid);
};

ViewSlider.prototype.getDuration = function() {
	return this.parts.getDuration();
};
	
ViewSlider.prototype.next = function() {
	this.pager.incPage(1);
};

ViewSlider.prototype.previous = function() {
	this.pager.incPage(-1);
};

var ViewSliderPart = function(data) {
	this.node = document.createElement("div");
	this.node.innerHTML = data.content;
	this.duration = data.duration;
	this.visible = data.visible;
};

var ViewSliderParts = function() {
	this.items = [];
};

ViewSliderParts.prototype.count = function() {
	return this.items.length;
};

ViewSliderParts.prototype.getDuration = function() {
	var result = 0;
	for (var i = 0; i < this.items.length; i++) {
		var part = this.items[i];
		result += part.duration;
	}
	return result;
};

ViewSlider.prototype.setFlip = function(value) {
	this.output.setFlip(value);
};

ViewSliderParts.prototype.getPartId = function(part) {
	for (var i = 0; i < this.items.length; i++) {
		if (this.items[i] == part)
			return i;
	}
	return false;
};

ViewSliderParts.prototype.getPartFromPosition = function(position) {
	var pos = 0;
	var part = null;
	for (var i = 0; i < this.items.length; i++) {
		part = this.items[i];
		if (position < pos + part.duration) {
			return part;
		}
		pos += part.duration;
	}
	return part;
};

ViewSliderParts.prototype.getPositionFromPart = function(part) {
	var pos = 0;
	for (var i = 0; i < this.items.length; i++) {
		if (part == this.items[i]) {
			return pos;
		}
		pos += this.items[i].duration;
	}
	return pos;
};

ViewSliderParts.prototype.clear = function() {
	this.items = [];
};

ViewSliderParts.prototype.push = function(part) {
	this.items.push(part);
};

var ViewSliderOutput = function() {
	this.node = document.createElement("div");
	this.contentNode = document.createElement("div");
	this.contentNode.className = "content";
	this.part = null;
	this.node.className = "output";

	this.node.appendChild(this.contentNode);
};

ViewSliderOutput.prototype.setPart = function(part) {
	if (part == this.part) 
		return;
	
	while (this.contentNode.firstChild) this.contentNode.removeChild(this.contentNode.firstChild);
	this.contentNode.appendChild(part.node);
	this.part = part;
	this.node.style.display = part.visible ? "" : "none";
};

ViewSliderOutput.prototype.getPart = function() {
	return this.part;
};

ViewSliderOutput.prototype.setSize = function(value) {
	this.node.setAttribute("style", "transform: translate(50vw, 50vh) translate(-50%, -50%) scale(" + value + ");");
};

ViewSliderOutput.prototype.setFlip = function(value) {
	this.contentNode.className = value ? "flip" : "";
};

ViewSliderPager = function(slider) {
	this.slider = slider;

	this.node = document.createElement("div");
	this.select = document.createElement("select");
	this.buttonNext = document.createElement("button");
	this.buttonPrev = document.createElement("button");

	this.current = null;

	this.init();
};

ViewSliderPager.prototype.init = function() {
	var self = this;

	this.node.className = "sliderPager";

	this.buttonPrev.appendChild(document.createTextNode("«"));
	this.node.appendChild(this.buttonPrev);
	this.buttonPrev.onclick = function() {
		self.incPage(-1);
	};

	this.node.appendChild(this.select);
	this.select.onchange = function(e) { self.onchange(e); };

	this.buttonNext.appendChild(document.createTextNode("»"));
	this.node.appendChild(this.buttonNext);
	this.buttonNext.onclick = function() {
		self.incPage(1);
	};

	this.setSize(0);
};

ViewSliderPager.prototype.setSize = function(size) {
	while (this.select.firstChild) this.select.removeChild(this.select.firstChild);
	for (var i = 0; i < size; i++) {
		this.addOption(i, i + 1);
	}
	this.size = size;
}

ViewSliderPager.prototype.add = function(node) {
	this.select.appendChild(node);
};

ViewSliderPager.prototype.addOption = function(value, title) {
	var option = document.createElement("option");
	option.setAttribute("value", value);
	option.appendChild(document.createTextNode(title));
	this.add(option);
};

ViewSliderPager.prototype.gotoPage = function(id) {
	if (this.setPage(id))
		this.slider.goto();
};

ViewSliderPager.prototype.setPage = function(id) {
	if (id < 0 || id >= this.size || id == this.current) return false;

	this.current = id;
	this.select.selectedIndex = id; 
	this.slider.setPartId(id);
	return true;
};

ViewSliderPager.prototype.getPage = function() {
	return this.current;
};

ViewSliderPager.prototype.incPage = function(n) {
	this.gotoPage(this.getPage() + n);
};

ViewSliderPager.prototype.onchange = function(e) {
	var index = this.select.selectedIndex;
	this.gotoPage(this.select.selectedIndex);
};

