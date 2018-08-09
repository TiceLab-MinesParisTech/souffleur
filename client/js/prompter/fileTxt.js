var FileTxt = function(filename, baseroot) {
	this.baseroot = baseroot;
	this.filename = filename;
	this.main = [];
	this.aux = [];
	this.currentAuxPart = null;
	this.meta = {};
};

FileTxt.prototype.pushTitle = function(level, title) {
	this.main.push({"content": "<h" + level + ">" + title + "</h1>", "duration": 1000});
};

FileTxt.prototype.parseTitle = function(str) {
	function occurences(str, size) {
		var result = "";
		for (var i = 0; i < size; i++) {
			result += str;
		}
		return result;
	}

	for (var i = 10; i >= 1; i--) {
		var markup = occurences("#", i);
		if (str.substr(0, i) == markup) {
			return {
				"level": i,
				"label": str.substr(i).trim()
			};
		}
	}
	return false;
};

FileTxt.prototype.parseMeta = function(line) {
	var pos = line.indexOf(":");
	if (!pos) return false;
	var key = line.substr(0, pos).trim();
	var value = line.substr(pos + 1).trim();
	return {"key": key, "value": value};
};

FileTxt.prototype.normalize = function(text) {
	var chars = [":", ";", "!", "?"];
	for (var i = 0; i < chars.length; i++) {
		var char = chars[i];
		text = text.replace(" " + char, " " + char);
	}

	var chars = {
		"'": "’",
		" \"": " “",
		"\" ": "” "
	};
	for (var key in chars) {
		text = text.replace(key, chars[key]);
	}

	return text;
};

FileTxt.prototype.pushMain = function(content, duration, className) {
	this.main.push({"content": content, "duration": duration, "className": className});

	if (this.currentAuxPart == null) this.pushAux();
	this.currentAuxPart.duration += duration;
};

FileTxt.prototype.pushPBreak = function(text) {
	this.pushMain("", 500, "pbreak");
};

FileTxt.prototype.pushLine = function(text) {
	this.pushMain(text, text.length * 60);
};

FileTxt.prototype.pushLi = function(text) {
	this.pushMain("<li>" + text + "</li>", text.length * 60);
};

FileTxt.prototype.setMeta = function(key, value) {
	this.meta[key] = value;
};

FileTxt.prototype.pushAux = function(content, title) {
	this.currentAuxPart = {"content": content, "duration": 0, "visible": content != null ? true : false, "title": title};
	this.aux.push(this.currentAuxPart);
};

FileTxt.prototype.hasAux = function() {
	return this.aux.length > 1 || (this.aux.length == 1 && this.aux[0].content != null);
};

FileTxt.prototype.pushAuxImg = function(src, title) {
	src = this.baseroot + "/" + src;
	this.pushAux("<img src=\"" + src + "\"/>", title);
	this.pushMain("<div class=\"slide\">" + title + "</div>", 1000);
};

FileTxt.prototype.parse = function(text) {
	var self = this;
	var pBreak = false;
	var content = false;
	
	var lines = text.split("\n");
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if (line.trim() == "") {
			pBreak = true;
		}
		else if (line.substr(0, 2) == "//") {
			var meta = this.parseMeta(line.substr(2));
			if (meta) this.setMeta(meta.key, meta.value);
		}
		else if (line.substr(0, 5) == "!img:") {
			var cols = line.substr(5).split(":");
			this.pushAuxImg(cols[0].trim(), cols[1].trim());
			pBreak = false;
		}
		else if (line.substr(0, 5) == "!--") {
			this.pushAux();
		}
		else if (title = this.parseTitle(line)) {
			this.pushTitle(title.level, title.label);
			pBreak = false;
			content = true;
		}
		else if (line.substr(0, 2) == "* ") {
			this.pushLi(line.substr(2));
			pBreak = false;
			content = true;
		}
		else {
			line = line.trim();
			line = this.normalize(line);
			if (pBreak && content) this.pushPBreak();
			this.pushLine(line);
			pBreak = false;
			content = true;
		}

	}
};


FileTxt.prototype.get = function() {
	var tracks = [];
	tracks.push(
		{
  		     	"name": "main",
			"type": "scroll",
			"parts": this.main
 		}
	);
	if (this.hasAux()) tracks.push(
		{
			"name": "aux",
			"type": "slider",
			"parts": this.aux
		}
	);

	return {
		"filename": this.filename,
		"meta": this.meta,
		"tracks": tracks
	};
};

