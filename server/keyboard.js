//inspired by https://github.com/Bornholm/node-keyboard
//See torvalds/linux/include/uapi/linux/input.h

var fs = require('fs');
var ref = require('ref');
var EventEmitter = require('events').EventEmitter;

function Keyboard() {
	this.fd = null;
	this.events = new EventEmitter();
	this.buffer = new Buffer(24);
}

Keyboard.prototype.open = function(device) {
	this.fd = fs.openSync(device, 'r');
	this.read();
};

Keyboard.prototype.on = function(name, cb) {
	this.events.on(name, cb);
};

Keyboard.prototype.read = function() {
	var self = this;
	fs.read(this.fd, this.buffer, 0, this.buffer.length, null, function(err, read) { self.onRead(err, read) } );
};

Keyboard.prototype.onRead = function(err, read) {
	if (read == 24) {
		var event = this.getInputEvent(this.buffer);
		var keyboardEvent = this.getKeyboardEvent(event);
		if (keyboardEvent) {
			this.events.emit(keyboardEvent.type, keyboardEvent);
		}
	}
	this.read();
};

Keyboard.prototype.getInputEvent = function(buffer) {
	if (buffer.length != 24)
		return false;
		
	var sec = buffer.readUInt64LE(0);
	var usec = buffer.readUInt64LE(8);
	var type = buffer.readUInt16LE(16);
	var code = buffer.readUInt16LE(18);
	var value = buffer.readUInt32LE(20);

	var types = {
		0x00: "EV_SYN",
		0x1: "EV_KEY",
		0x2: "EV_REL",
		0x3: "EV_ABS",
		0x4: "EV_MSC",
		0x5: "EV_SW",
		0x11: "EV_LED",
		0x12: "EV_SND",
		0x14: "EV_REP",
		0x15: "EV_FF",
		0x16: "EV_PWR",
		0x17: "EV_FF_STATUS"
	};
	
	return {
		"sec": sec,
		"usec": usec,
		"type": type in types ? types[type] : false,
		"code": code,
		"value": value
	};
};

Keyboard.prototype.getKeyboardEvent = function(inputEvent) {
	if (inputEvent.type != "EV_KEY")
		return false;
		
	var values = {
		0: "KEYUP",
		1: "KEYPRESS",
		2: "KEYDOWN"
	};

	var codes = {
		1: "KEY_ESC",
		2: "KEY_1",
		3: "KEY_2",
		4: "KEY_3",
		5: "KEY_4",
		6: "KEY_5",
		7: "KEY_6",
		8: "KEY_7",
		9: "KEY_8",
		10: "KEY_9",
		11: "KEY_0",
		12: "KEY_MINUS",
		13: "KEY_EQUAL",
		14: "KEY_BACKSPACE",
		15: "KEY_TAB",
		16: "KEY_Q",
		17: "KEY_W",
		18: "KEY_E",
		19: "KEY_R",
		20: "KEY_T",
		21: "KEY_Y",
		22: "KEY_U",
		23: "KEY_I",
		24: "KEY_O",
		25: "KEY_P",
		26: "KEY_LEFTBRACE",
		27: "KEY_RIGHTBRACE",
		28: "KEY_ENTER",
		29: "KEY_LEFTCTRL",
		30: "KEY_A",
		31: "KEY_S",
		32: "KEY_D",
		33: "KEY_F",
		34: "KEY_G",
		35: "KEY_H",
		36: "KEY_J",
		37: "KEY_K",
		38: "KEY_L",
		39: "KEY_SEMICOLON",
		40: "KEY_APOSTROPHE",
		41: "KEY_GRAVE",
		42: "KEY_LEFTSHIFT",
		43: "KEY_BACKSLASH",
		44: "KEY_Z",
		45: "KEY_X",
		46: "KEY_C",
		47: "KEY_V",
		48: "KEY_B",
		49: "KEY_N",
		50: "KEY_M",
		51: "KEY_COMMA",
		52: "KEY_DOT",
		53: "KEY_SLASH",
		54: "KEY_RIGHTSHIFT",
		55: "KEY_KPASTERISK",
		56: "KEY_LEFTALT",
		57: "KEY_SPACE",
		58: "KEY_CAPSLOCK",
		59: "KEY_F1",
		60: "KEY_F2",
		61: "KEY_F3",
		62: "KEY_F4",
		63: "KEY_F5",
		64: "KEY_F6",
		65: "KEY_F7",
		66: "KEY_F8",
		67: "KEY_F9",
		68: "KEY_F10",
		69: "KEY_NUMLOCK",
		70: "KEY_SCROLLLOCK",
		71: "KEY_KP7",
		72: "KEY_KP8",
		73: "KEY_KP9",
		74: "KEY_KPMINUS",
		75: "KEY_KP4",
		76: "KEY_KP5",
		77: "KEY_KP6",
		78: "KEY_KPPLUS",
		79: "KEY_KP1",
		80: "KEY_KP2",
		81: "KEY_KP3",
		82: "KEY_KP0",
		83: "KEY_KPDOT",
		85: "KEY_ZENKAKUHANKAKU",
		86: "KEY_102ND",
		87: "KEY_F11",
		88: "KEY_F12",
		89: "KEY_RO",
		90: "KEY_KATAKANA",
		91: "KEY_HIRAGANA",
		92: "KEY_HENKAN",
		93: "KEY_KATAKANAHIRAGANA",
		94: "KEY_MUHENKAN",
		95: "KEY_KPJPCOMMA",
		96: "KEY_KPENTER",
		97: "KEY_RIGHTCTRL",
		98: "KEY_KPSLASH",
		99: "KEY_SYSRQ",
		100: "KEY_RIGHTALT",
		101: "KEY_LINEFEED",
		102: "KEY_HOME",
		103: "KEY_UP",
		104: "KEY_PAGEUP",
		105: "KEY_LEFT",
		106: "KEY_RIGHT",
		107: "KEY_END",
		108: "KEY_DOWN",
		109: "KEY_PAGEDOWN",
		110: "KEY_INSERT",
		111: "KEY_DELETE",
		112: "KEY_MACRO",
		113: "KEY_MUTE",
		114: "KEY_VOLUMEDOWN",
		115: "KEY_VOLUMEUP",
		116: "KEY_POWER",
		117: "KEY_KPEQUAL",
		118: "KEY_KPPLUSMINUS",
		119: "KEY_PAUSE",
		120: "KEY_SCALE"
	};

	return {
		"sec": inputEvent.sec,
		"usec": inputEvent.usec,
		"code": inputEvent.code in codes ? codes[inputEvent.code] : false,
		"value": inputEvent.value in values ? values[inputEvent.value] : false
	};
};

Keyboard.prototype.close = function(callback) {
	fs.closeSync(this.fd);
	this.fd = null;
};

module.exports = Keyboard;
