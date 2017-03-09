var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/auth/vk',
	passport.authenticate('vk-strategy', {scope: ['email']})/*, 
	function(req, res) {
		// The request will be redirected to vk.com for authentication, so
		// this function will not be called.
	}*/);

router.get('/auth/vk/callback',
	passport.authenticate('vk-strategy', { failureRedirect: '/login' }),
	function(req, res) {
		// Successful authentication, redirect home.
		res.redirect('/');
	});

module.exports = router;
