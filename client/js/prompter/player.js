var Player = function(module) {
	this.module = module;
	
	this.interval = null;
	this.playDate = null;
	this.playPosition = null;
	this.playSpeed = null;
	this.position = 0;
}

Player.prototype.isPlaying = function() {
	return this.interval != null;
};

Player.prototype.getPositionFromDate = function(date) {
	return this.playPosition + Math.abs(date - this.playDate) * this.playSpeed;
}

Player.prototype.getPosition = function() {
	return this.isPlaying() ? this.getPositionFromDate(new Date()) : this.position;
}

Player.prototype.setPosition = function(position) {
	this.position = position;
	
	if (position >= this.module.view.getDuration() || position < 0) {
		this.module.stop();
		return;
	}
	this.module.view.setPosition(position);
};

Player.prototype.update = function() {
	this.setPosition(this.getPosition());
};

Player.prototype.play = function(position, speed) {
	this.playDate = new Date();
	this.playPosition = position;
	this.playSpeed = speed;
	this.setInterval();
};

Player.prototype.stop = function(position) {
	this.unsetInterval();
	if (position != null) this.setPosition(position);
};

Player.prototype.setInterval = function() {
	if (this.interval) return;

	var self = this;
	this.interval = setInterval(function() { self.update() }, 10);
}

Player.prototype.unsetInterval = function() {
	if (!this.interval) return;

	clearInterval(this.interval);
	this.interval = null;
};

