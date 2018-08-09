var ViewScroll = function(terminal) {
	this.terminal = terminal;
	
	this.node = document.createElement("div");
	this.parts = new ViewScrollParts();
	this.target = new ViewScrollTarget();
	this.scroller = new ViewScrollScroller();
	
	this.init();
};

ViewScroll.prototype.setSize = function(value) {
	this.scroller.setSize(value);
};

ViewScroll.prototype.init = function() {
	var self = this;
	this.node.className = "viewScroll";
	this.node.appendChild(this.target.node);

	this.node.appendChild(this.scroller.node);
	this.scroller.node.appendChild(this.parts.node);

	this.node.onclick = function(e) { self.onclick(e); return false; };
	this.node.ondblclick = function(e) { self.ondblclick(e); return false; };
};

ViewScroll.prototype.load = function(data) {
	this.parts.clear();
	for (var i = 0; i < data.length; i++) {
		this.parts.push(new ViewScrollPart(data[i]));
	};
};

ViewScroll.prototype.getClickPosition = function(e) {
	if (e.target == this.scroller.node) return;
	
	var y = "offsetY" in e ? e.offsetY : 0;
	var offset = e.target.offsetTop + y - this.parts.node.offsetTop;
	return this.parts.getPositionFromOffset(offset);
};

ViewScroll.prototype.onclick = function(e) {
	var position = this.getClickPosition(e);
	this.terminal.emitStop(position);
};

ViewScroll.prototype.ondblclick = function(e) {
	var position = this.getClickPosition(e);
	this.terminal.emitPlay(position);
};

ViewScroll.prototype.setOffset = function(value) {
	var scrollTop = this.parts.node.offsetTop - this.target.node.offsetTop + value;
	if (this.scroller.node.scrollTop != scrollTop)
		this.scroller.node.scrollTop = scrollTop
};

ViewScroll.prototype.getOffsetOf = function(y) {
	return this.scroller.node.scrollTop - this.parts.node.offsetTop + y;
};

ViewScroll.prototype.getOffset = function() {
	return this.getOffsetOf(this.target.node.offsetTop);
};

ViewScroll.prototype.getPosition = function() {
	return this.parts.getPositionFromOffset(this.getOffset());
};

ViewScroll.prototype.setPosition = function(position) {
	var offset = this.parts.getOffsetFromPosition(position);
	this.setOffset(offset);
};

ViewScroll.prototype.getDuration = function() {
	return this.parts.getDuration();
};

ViewScroll.prototype.next = function() {
	var arr = this.parts.getPartFromPosition(this.getPosition());
	if (!arr) return;
	
	var newPart = this.parts.getPartFromId(arr.id + 1);
	if (!newPart) return;
	
	var newPosition = this.parts.getPositionFromPart(newPart);
	this.terminal.emitStop(newPosition);
};

ViewScroll.prototype.previous = function() {
	var arr = this.parts.getPartFromPosition(this.getPosition());
	if (!arr) return;
	
	var newPart = arr.position > 0 ? arr.part : this.parts.getPartFromId(arr.id - 1);
	if (!newPart) return;
	
	var newPosition = this.parts.getPositionFromPart(newPart);
	this.terminal.emitStop(newPosition);
};

var ViewScrollPart = function(data) {
	this.node = document.createElement("div");
	this.node.innerHTML = data.content;
	if ("className" in data) this.node.className = data.className;
	this.duration = data.duration;
}

var ViewScrollTarget = function() {
	this.node = document.createElement("div");
	this.node.className = "target";
}

var ViewScrollParts = function() {
	this.items = [];

	this.node = document.createElement("div");
	this.node.className = "parts";
}

ViewScrollParts.prototype.getDuration = function() {
	var result = 0;
	for (var i = 0; i < this.items.length; i++) {
		var part = this.items[i];
		result += part.duration;
	}
	return result;
};

ViewScrollParts.prototype.getEnd = function() {
	var id = this.items.length - 1;
	var part = this.items[id];
	
	return {
		"id": id,
		"part": part,
		"position": part.duration - 1
	};
};

ViewScrollParts.prototype.getPartFromId = function(id) {
	return id < this.items.length ? this.items[id] : null;
};

ViewScrollParts.prototype.getPartFromPosition = function(position) {
	var pos = 0;
	for (var i = 0; i < this.items.length; i++) {
		var part = this.items[i];
		if (position < pos + part.duration) {
			return {
				"id": i,
				"part": part,
				"position": position - pos
			};
		}
		pos += part.duration;
	}
	return this.getEnd();
};

ViewScrollParts.prototype.getPositionFromPart = function(part) {
	var pos = 0;
	for (var i = 0; i < this.items.length; i++) {
		if (part == this.items[i]) {
			return pos;
		}
		pos += this.items[i].duration;
	}
	return pos;
};

ViewScrollParts.prototype.getOffsetFromPosition = function(position) {
	var pos = 0;
	var lastOffset = 0;
	for (var i = 0; i < this.items.length; i++) {
		var part = this.items[i];
		if (position < pos + part.duration) {
			return Math.floor(part.node.offsetTop - this.node.offsetTop + part.node.offsetHeight * (position - pos) / part.duration);
		}
		pos += part.duration;
		lastOffset = part.node.offsetTop - this.node.offsetTop + part.node.offsetHeight;
	}
	return lastOffset;
};

ViewScrollParts.prototype.getPositionFromOffset = function(offset) {
	var position = 0;
	for (var i = 0; i < this.items.length; i++) {
		var part = this.items[i];
		var top = part.node.offsetTop - this.node.offsetTop;
		if (offset < top + part.node.offsetHeight) {
			var result = Math.floor(position + part.duration * (offset - top) / part.node.offsetHeight);
			return result > 0 ? result : 0;
		}
		position += part.duration;
	}
	return position - 1;
};

ViewScrollParts.prototype.clear = function() {
	this.items = [];
	while (this.node.firstChild) this.node.removeChild(this.node.firstChild);
};

ViewScrollParts.prototype.push = function(part) {
	this.items.push(part);
	this.node.appendChild(part.node);
};

var ViewScrollScroller = function() {
	this.node = document.createElement("div");
	this.node.className = "scroller";
};

ViewScrollScroller.prototype.setSize = function(value) {
	this.node.style.fontSize = Math.floor(value * 100) + "%";
};


