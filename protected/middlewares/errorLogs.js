'use strict';

var morgan = require('morgan');
var fs = require('fs');
var join = require('path').join;

var config = require(join(__dirname, '../config'));

module.exports = function(app) {

	if(app.get('env') === 'development') {
		app.use(morgan('dev'));
	}

	if(app.get('env') === 'production') {
		app.use(morgan('combined', {
			stream: fs.createWriteStream(join(__dirname, config.get('logsPath'), 'access.log'), {
				flags: 'a'
			})
		}));
	}
};
