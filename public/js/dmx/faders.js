var Faders = function(tool) {
	this.tool = tool;
	this.node = document.createElement("div");
	this.init();
	this.faders = {};
};

Faders.prototype.setChannels = function(channels) {
	this.channels = channels;
};

Faders.prototype.init = function() {
	this.node.className = "faders";
};

Faders.prototype.getDmxChannels = function(list) {
	var result = [];
	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		if (typeof item == "string") {
			result.push(this.channels[item]);
		}
		else {
			result.push(item);
		}
	}
	return result;
};

Faders.prototype.createGroup = function(item) {
	var fieldset = document.createElement("fieldset");
	if (item.title) {
		var legend = document.createElement("legend");
		legend.appendChild(document.createTextNode(item.title));
		fieldset.appendChild(legend);
	}
	this.createItems(fieldset, item.faders);
	return fieldset;
};

Faders.prototype.createFader = function(item) {
	var fader = new Fader(this.tool, item.ref, item.title, item.min ? item.min : 0, item.max ? item.max : 100, item.step ? item.step : 1, item.marks, item.format ? item.format : "%d %", this.getDmxChannels(item.channels));
	this.faders[fader.ref] = fader;
	return fader.node;
};

Faders.prototype.createItem = function(item) {
	if (item.type == "group") {
		return this.createGroup(item);
	}
	return this.createFader(item);	
};

Faders.prototype.createItems = function(container, items) {
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		container.appendChild(this.createItem(item));
	}
};

Faders.prototype.create = function(items) {
	this.createItems(this.node, items);
};

Faders.prototype.setValue = function(ref, value) {
	if (ref in this.faders) this.faders[ref].setValue(value);
};

