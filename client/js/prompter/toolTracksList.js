var ToolTracksList = function(terminal) {
	this.terminal = terminal;

	this.node = document.createElement("select");
	this.items = [];
	this.current = null;
	this.init();
};

ToolTracksList.prototype.init = function() {
	var self = this;
	this.node.className = "tool toolTrack";
	
	this.node.onchange = function(e) { self.onchange(e); };
	this.setTracks([]);
};

ToolTracksList.prototype.setVisibility = function(value) {
	this.node.style.display = value ? "" : "none";
};

ToolTracksList.prototype.setItem = function(item) {
	if (item == this.current) return;
	this.current = item;
	this.terminal.loadTrack(item.track);
};

ToolTracksList.prototype.onchange = function(e) {
	var index = this.node.selectedIndex;
	var item = this.items[index];
	this.setItem(item);
};

ToolTracksList.prototype.clear = function() {
	this.items = [];
	while (this.node.firstChild) this.node.removeChild(this.node.firstChild);
};

ToolTracksList.prototype.push = function(item) {
	this.items.push(item);
	this.node.appendChild(item.node);
};

ToolTracksList.prototype.set = function(value) {
	for (var i = 0; i < this.items.length; i++) {
		var item = this.items[i];
		if (item.track.name == value) {
			this.node.selectedIndex = i;
			this.setItem(item);
			return;
		}
	}
	this.onchange();
};

ToolTracksList.prototype.setTracks = function(tracks) {
	this.clear();
	for (var i = 0; i < tracks.length; i++) {
		var track = tracks[i];
		var item = new ToolTracksListItem(track.name, track);
		this.push(item);
	}
	this.setVisibility(tracks.length > 1);
}

ToolTracksListItem = function(title, track) {
	this.node = document.createElement("option");
	this.node.appendChild(document.createTextNode(title));
	this.track = track;
}

