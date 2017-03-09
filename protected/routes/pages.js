'use strict';

var express = require('express');
var router = express.Router();

/**
 * Index route
 */
router.route('/')
	.get(function(req, res) {
		res.render('pages/index', {
			title: 'Project',
			user: req.user
		});
	});

router.route('/support')
	.get(function(req, res) {
		res.send('Feedback');
	});

module.exports = router;
