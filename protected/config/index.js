'use strict';

var nconf = require('nconf');
var join = require('path').join;

nconf
	.argv()
	.env()
	.file('base', join(__dirname, 'config.json'))
	.file('local', join(__dirname, 'config-local.json'))
	.file('auth', join(__dirname, 'auth.json'));

module.exports = nconf;
