var Keyboard = function(terminal) {
	this.terminal = terminal;
	this.init();
};

Keyboard.prototype.keyMapping = {
	27: "Escape",
	32: " ",
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

Keyboard.prototype.actionMapping = {
	" ": {"name": "PlayStop"},
	"F5": {"name": "RecordStartStop"},
	"Escape": {"name": "RecordStartStop"},
	":": {"name": "PlayStop"},
	"+": {"name": "IncSpeed", "args": [0.1]},
	"-": {"name": "IncSpeed", "args": [-0.1]},
	"v": {"name": "ToggleToolbarVisibility"},
	"PageUp": {"name": "Dec", "args": [0.1]},
	"PageDown": {"name": "Inc", "args": [0.1]}
};

Keyboard.prototype.init = function() {
	var self = this;
	document.onkeydown = function(e) { 
		var tagName = e.target.tagName;
		var reserved = {
			"INPUT": true,
			"TEXTAREA": true
		};
		return (tagName in reserved) ? true : self.onkeydown(e);
	};
};

Keyboard.prototype.onkeydown = function(e) {
	console.log(e.key, e.keyCode, e.which);

	var key = e.keyCode in this.keyMapping ? this.keyMapping[e.keyCode] : e.key;
	if (!key) return true;
	
	if (!(key in this.actionMapping)) return true;
	var action = this.actionMapping[key];

	var method = "action" + action.name;
	if (!method in this) return true;
	this[method].apply(this, action.args);
	
	return false;
};

//--Actions
Keyboard.prototype.actionPlayStop = function() {
	this.terminal.toolbar.toolStartStop.emitPlayStop();
};

Keyboard.prototype.actionStop = function() {
	this.terminal.emitStop();
};

Keyboard.prototype.actionPlay = function() {
	this.terminal.emitPlay();
};

Keyboard.prototype.actionRecordStop = function() {
	this.terminal.emitRecorderStop();
};

Keyboard.prototype.actionRecordStart = function() {
	this.terminal.emitRecorderStart();
};

Keyboard.prototype.actionRecordStartStop = function() {
	this.terminal.toolbar.toolRecorder.startStop();
};

Keyboard.prototype.actionIncSpeed = function(value) {
	this.terminal.toolbar.toolSpeed.emitIncSpeed(value);
};

Keyboard.prototype.actionToggleToolbarVisibility = function() {
	this.terminal.settings.switchParam("toolbarVisibility");
};

Keyboard.prototype.actionNext = function() {
	this.terminal.view.next();
};

Keyboard.prototype.actionPrevious = function() {
	this.terminal.view.previous();
};

Keyboard.prototype.actionInc = function(value) {
	if (this.terminal.player.isPlaying())
		this.actionIncSpeed(value);
	else
		this.actionNext();
};

Keyboard.prototype.actionDec = function(value) {
	if (this.terminal.player.isPlaying())
		this.actionIncSpeed(value * -1);
	else
		this.actionPrevious();
};

