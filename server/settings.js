const SQlite3 = require('sqlite3');

var Settings = function(path) {
	this.db = null;
};

Settings.prototype.open = function(path) {
	this.db = new SQlite3.Database(path);
};

Settings.prototype.getAll = function(table, cb) {
	this.db.each("SELECT * FROM " + table + ";", function(err, row) {
		if (err) {
			console.log(err);
			return;
		}
		cb(row);
	});
};

Settings.prototype.set = function(table, key, value) {
	var self = this;

	var stmt = this.db.prepare("UPDATE " + table + " SET value = ? WHERE key = ?;");
	stmt.run([value, key], function(err) {
		if (this.changes == 0) {
			var stmt = self.db.prepare("INSERT INTO dmx(key, value) VALUES(?, ?);");
			stmt.run([key, value]);
		}
	});
};

module.exports = Settings; 
