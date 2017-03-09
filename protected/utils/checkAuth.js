'use strict';

function checkAuth(req, res, next) {
	if(req.isAuthenticated()) return res.redirect('/');
	next();
}

module.exports = checkAuth;
