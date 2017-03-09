'use strict';

var express = require('express');
var router = express.Router();
var requireTree = require('require-tree');
var controllers = requireTree('../controllers/');

router.get('/tasks', function(req, res, next) {
	res.send('Tasks');
});

router.route('/task/add')
	.get(function(req, res, next) {
		res.send('Task add');
	});

module.exports = router;
