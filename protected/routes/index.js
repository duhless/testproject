'use strict';

var join = require('path').join;

module.exports = function(app) {
	// The main page with a language passed
	/*app.param('locale', function (req, res, next) {
		res.cookie('i18n', req.params.locale);
		//res.redirect("/");
		next();
	});*/

	app.use(require(join(__dirname, '/pages')));
	app.use(require(join(__dirname, '/users')));
	app.use(require(join(__dirname, '/tasks')));
	app.use(require(join(__dirname, '/auth')));

	app.use('*', function(req, res) {
    res.status(404)
      .render('404');
  });
};
