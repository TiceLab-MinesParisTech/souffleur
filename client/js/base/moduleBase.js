var ModuleBase = function(terminal) {
	this.terminal = terminal;

	this.toolTerminals = new ToolTerminals(this);
	this.toolAbout = new ToolAbout(this);

	this.init();
};

ModuleBase.prototype.init = function() {
	var self = this;
	
	this.terminal.client.on("notify", function(args) { self.onNotify(args); });
	this.terminal.client.on("id", function(args) { self.onId(args); });

	this.terminal.menubar.addTool("Settings", this.toolTerminals);
	this.terminal.menubar.addTool("About…", this.toolAbout);

	this.terminal.settings.addParam(new SettingsParamString("name", function(value) { self.applyName(value) }, "name", null, "<anonymous>"));
	this.terminal.settings.addParam(new SettingsParamBool("flip", function(value) { self.applyFlip(value) }, "flip", false));
	this.terminal.settings.addParam(new SettingsParamBool("toolbarVisibility", function(value) { self.applyToolbarVisibility(value) }, "toolbar", true));
	this.terminal.settings.addParam(new SettingsParamBool("notifierVisibility", function(value) { self.applyNotifierVisibility(value) }, "notifications", true));
	this.terminal.settings.addParam(new SettingsParamChoice("colors", function(value) { self.applyColors(value) }, "colors", "", {"": "Black on white", "wb": "White on black"}));

	this.terminal.keyboard.on("v", function() { self.kbdToggleToolbar(); });
};

ModuleBase.prototype.kbdToggleToolbar = function() {
	this.terminal.settings.switchParam("toolbarVisibility");
};

ModuleBase.prototype.applyName = function(value) {
};

ModuleBase.prototype.applyFlip = function(value) {
	this.terminal.setFlip(value);
};

ModuleBase.prototype.applyToolbarVisibility = function(value) {
	this.terminal.toolbar.setVisibility(value);
	this.terminal.actionbar.setVisibility(value);
};

ModuleBase.prototype.applyNotifierVisibility = function(value) {
	this.terminal.notifier.setVisibility(value);
}

ModuleBase.prototype.applyColors = function(value) {
	this.terminal.setColors(value);
};

ModuleBase.prototype.onNotify = function(text) {
	this.terminal.notifier.show(text);
};

ModuleBase.prototype.onId = function() {
	this.terminal.notifier.show(terminal.settings.renderParam("name"), true);
};


