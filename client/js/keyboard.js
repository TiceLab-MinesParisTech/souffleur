var Keyboard = function() {
	this.mapping = {};
	this.init();
};

Keyboard.prototype.keyMapping = {
	27: "Escape",
	32: "Space",
	37: "ArrowLeft",
	38: "ArrowUp",
	39: "ArrowRight",
	40: "ArrowDown",
	33: "PageUp",
	34: "PageDown",
	86: "v",
	107: "+",
	109: "-",
	116: "F5",
	186: ":"
};

Keyboard.prototype.init = function() {
	var self = this;
	document.onkeydown = function(e) { 
		var tagName = e.target.tagName;
		var reserved = {
			"BUTTON": true,
			"INPUT": true,
			"TEXTAREA": true
		};
		return (tagName in reserved) ? true : self.onkeydown(e);
	};
};

Keyboard.prototype.onkeydown = function(e) {
	console.log(e.key, e.keyCode, e.which);
	//console.log(this.keyMapping);

	var key = e.keyCode in this.keyMapping ? this.keyMapping[e.keyCode] : e.key;
	if (!key) return true;

	console.log(key);
	return this.dispatchEvent(key);
};

Keyboard.prototype.on = function(name, cb) {
	console.log("event:", name);
	this.mapping[name] = true;
	document.addEventListener("shortcut:" + name, cb);
};

Keyboard.prototype.dispatchEvent = function(name) {
	
	if (!(name in this.mapping))
		return true;	

	var event = new Event("shortcut:" + name);
	console.log(event);
	document.dispatchEvent(event);
	return false;
};

