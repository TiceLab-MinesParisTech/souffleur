var Faders = function() {
	this.node = document.createElement("div");
	this.init();
};

Faders.prototype.init = function() {
	this.node.className = "faders";
};

Faders.prototype.add = function(widget) {
	this.node.appendChild(widget.node);
};

Faders.prototype.getDmxChannels = function(list, channels) {
	var result = [];
	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		if (typeof item == "string") {
			result.push(channels[item]);
		}
		else {
			result.push(item);
		}
	}
	return result;
};

Faders.prototype.create = function(items, channels) {
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		this.add(new Fader(item.ref, item.title, item.min ? item.min : 0, item.max ? item.max : 100, item.step ? item.step : 1, item.marks, item.format ? item.format : "%d %", this.getDmxChannels(item.channels, channels)));
	}
};
