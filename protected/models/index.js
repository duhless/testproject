'use strict';

var mongoose = require('mongoose');
var join = require('path').join;
var config = require(join(__dirname, '../config'));
var debug = require('debug')('app:db');

var connection = mongoose.connection;

function mongoConnect() {
	mongoose.connect(config.get('db:mongo'));
}

mongoConnect();
connection
	.on('error', function(err) {
		debug(err);
	})
	.on('disconnected', mongoConnect)
	.on('connected', function() {
		debug('MongoDB connected');
	});

module.exports = mongoose;
