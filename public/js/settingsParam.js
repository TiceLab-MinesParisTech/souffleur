var SettingsParam = function(key, title, defaultValue) {
	this.key = key;
	this.title = title;
	this.defaultValue = defaultValue;
};

SettingsParam.prototype.getKey = function() {
	return this.key;
};

SettingsParam.prototype.getTitle = function() {
	return this.title;
};

SettingsParam.prototype.getDefaultValue = function() {
	return this.defaultValue;
};

SettingsParam.prototype.parse = function(value) {
	return value;
};

SettingsParam.prototype.render = function(value) {
	return value;
};

SettingsParam.prototype.isValid = function(value) {
	return true;
}

//SettingsParamString
var SettingsParamString = function(key, title, defaultValue, placeholder) {
	SettingsParam.call(this, key, title, defaultValue);
	this.placeholder = placeholder;
};
SettingsParamString.prototype = Object.create(SettingsParam.prototype);

SettingsParamString.prototype.render = function(value) {
	if (!value && this.placeholder) return this.placeholder;
	return "“" + value + "”";
};

//SettingsParamFloat
var SettingsParamFloat = function(key, title, defaultValue, min, max, step) {
	SettingsParam.call(this, key, title, defaultValue);
	this.min = min;
	this.max = max;
	this.step = step;
};
SettingsParamFloat.prototype = Object.create(SettingsParam.prototype);

SettingsParamFloat.prototype.parse = function(value) {
	value = parseFloat(value);
	return isNaN(value) ? undefined : value;
};

SettingsParamFloat.prototype.isValid = function(value) {
	if (this.min != null && value < this.min) return false;
	if (this.max != null && value > this.max) return false;
	return true;
}

SettingsParamFloat.prototype.inc = function(value, steps) {
	return this.step != null ? value + steps * this.step : value; 
};

//SettingsParamPercent
var SettingsParamPercent = function(key, title, defaultValue, min, max, step) {
	SettingsParamFloat.call(this, key, title, defaultValue, min, max, step);
};
SettingsParamPercent.prototype = Object.create(SettingsParamFloat.prototype);

SettingsParamPercent.prototype.render = function(value) {
	return Math.round(value * 100) + "%";
};


//SettingsParamBool
var SettingsParamBool = function(key, title, defaultValue) {
	SettingsParam.call(this, key, title, defaultValue);
};

SettingsParamBool.prototype = Object.create(SettingsParam.prototype);

SettingsParamBool.prototype.parse = function(value) {
	return value == "true" ? true : false;
};

SettingsParamBool.prototype.render = function(value) {
	return value ? "enabled" : "disabled";
};

//SettingsParamChoice
var SettingsParamChoice = function(key, title, defaultValue, choices) {
	SettingsParam.call(this, key, title, defaultValue);
	this.choices = choices;
};
SettingsParamChoice.prototype = Object.create(SettingsParam.prototype);

SettingsParamChoice.prototype.render = function(value) {
	return value in this.choices ? this.choices[value] : "-";
};
