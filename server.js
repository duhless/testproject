'use strict';

var fs = require('fs');
var https = require('https');
var mongoose = require('mongoose');
var join = require('path').join;
var debug = require('debug')('app:server');

var config = require(join(__dirname, 'protected/config'));
var app = require(join(__dirname, 'protected/app'));

require(join(__dirname, 'protected/models'));


https
	.createServer({
		key: fs.readFileSync(join(__dirname, 'key.pem')),
		cert: fs.readFileSync(join(__dirname, 'cert.pem'))
	}, app)
	.listen(process.env.PORT || config.get('port'), function(err) {
		if(err) throw new Error(err);
		debug('Server created on port %d.', process.env.PORT || config.get('port'));
	});
