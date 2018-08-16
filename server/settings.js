const SQlite3 = require('sqlite3');

var Settings = function(path) {
	this.db = null;
};

Settings.prototype.open = function(path) {
	this.db = new SQlite3.Database(path);
};

Settings.prototype.get = function(table, cb) {
	this.db.each("SELECT * FROM " + table + ";", function(err, row) {
		if (err) {
			console.log(err);
			return;
		}
		cb(row);
	});
};

module.exports = Settings; 
