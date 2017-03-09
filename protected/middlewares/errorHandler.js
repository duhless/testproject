module.exports = function(app) {
	app.use(function(req, res) {
		res.status(404)
			.render('error', {
				message: 'Страница не найдена'
			});
	});

	app.use(function(err, req, res, next) {
		if (err.status !== 403) return next();
		res.status(403)
			.render('error', {
				message: err
			});
	});
};
