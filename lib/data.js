/*
 * Library for storring and additing data
 *
 */

// Dependendecies
var fs = require('fs');
var path = require('path');
var helpers = require ("./helpers");

// Container
var lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = function (dir, file, data, callback) {
	// Open file for writing
	fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function (err, fileDescriptor) {
		if (!err && fileDescriptor) {
			// Convert data to string
			var stringData = JSON.stringify(data);

			// Write file and close it
			fs.writeFile(fileDescriptor, stringData, function (err) {
				if (!err) {
					fs.close(fileDescriptor, function (err) {
						if (!err) {
							callback(false);
						} else {
							callback('Error closing new file');
						}
					});
				} else {
					callback('Error writing to new file');
				}
			});
		} else {
			callback('Could not create new file, it may alreade exist');
		}
	});
};

// Read data from the file
lib.read = function (dir, file, callback) {
	fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function (err, data) {
		if (!err && data) {
			var parsedData = helpers.parseJsonToObject(data);
			callback(false, parsedData);
		} else {
			callback(err, data);
		}
	});
};

// Update data inside a file
lib.update = function (dir, file, data, callback) {
	// Open the file for writing
	fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function (err, fileDescriptor) {
		if (!err && fileDescriptor) {
			// Convert data to string
			var stringData = JSON.stringify(data);

			// Truncate the file
			fs.ftruncate(fileDescriptor, function (err) {
				if (!err) {
					// Write to the file and close it
					fs.writeFile(fileDescriptor, stringData, function (err) {
						if (!err) {
							fs.close(fileDescriptor, function (err) {
								if (!err) {
									callback(false);
								} else {
									callback('Error closing existing file');
								}
							});
						} else {
							callback('Error writing to existing file');
						}
					});
				} else {
					callback('Error truncating file');
				}
			});
		} else {
			callback('Could not open the file for updating, it not exist yet');
		}
	});
};

// Delete a file
lib.delete = function (dir, file, callback) {
	// Unlink the file
	fs.unlink(lib.baseDir + dir + '/' + file + '.json', function (err) {
		if (!err) {
			callback(false);
		} else {
			callback('Error deleting file');
		}
	});
};

// Export the module
module.exports = lib;
