'use strict';

var path = require('path');
var passport = require('passport');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;
var moment = require('moment');

var config = require(path.join(__dirname, '../config'));
var Users = require(path.join(__dirname, '../models/Users'));

exports.signup = {

	getForm: function(req, res) {
		res.render('users/signup', {
			title: 'Регистрация',
			csrfToken: req.csrfToken(),
			message: req.flash('signupMessage'),
			user: '' //new Users()
		});
	},

	do: function(req, res, next) {
		passport.authenticate('signup-strategy', function(err, user, info) {
			if (err) return next(err);
			if (!user) {
				//if(req.xhr) {
					return res.json([{ message: info }]);
				//} else {
				//	res.redirect('/');
				//}
			}
			req.logIn(user, function(err) {
				if (err) return next(err);
				return res.redirect('/');
			});

		})(req, res, next);
	}

};

exports.signin = {

	getForm: function(req, res) {
		res.render('users/signin', {
			title: 'Вход',
			csrfToken: req.csrfToken(),
			message: req.flash('signinMessage'),
			user: ''
		});
	},

	do: function(req, res, next) {
		passport.authenticate('signin-strategy', function(err, user, info) {
			if (err) return next(err);

			if (!user) return res.json([{ message: info }]);

			req.logIn(user, function(err) {
				if (err) return next(err);

				console.log(user);
				return res.redirect('/');
			});
		})(req, res, next);
	}

};

exports.forgot = {

	getForm: function(req, res, next) {
		res.render('users/forgot', {
			title: 'Восстановление пароля',
			csrfToken: req.csrfToken(),
			user: ''
		});
	},

	do: function(req, res, next) {
		async.waterfall([
			function(done) {
				crypto.randomBytes(20, function(err, buf) {
					var token = buf.toString('hex');
					done(err, token);
				});
			},
			function(token, done) {
				Users.updateInfo(req.body.email, {
					'protected.resetPasswordToken': token,
					'protected.resetPasswordExpires': Date.now() + (((60000*60)*24)*3)
				}, function(err, user, info) {
					if(!user) res.json([{status: info}]);
					done(err, token, user.email);
				});
			},
			function(token, user, done) {
				var template = new EmailTemplate(path.join(__dirname, '../templates/remind'));
				template.render({
					host: req.headers.host,
					token: token
				}, function(err, result) {
					done(err, user, result);
				});
			},
			function(user, template, done) {
				var transporter = nodemailer.createTransport(config.get('mailer:transport'));
				var mailOptions = {
					to: user,
					from: config.get('mailer:from'),
					subject: 'Forgot password',
					//text: result.text,
					html: template.html
				};
				transporter.sendMail(mailOptions, function(err) {
					done(err, 'success');
				});
			}
		], function(err, status) {
			if(err) return next(err);
			res.json([{status: status}]);
		});
	}

};

exports.getAll = function(req, res, next) {

	return Users.find({}, '-protected', function(err, users) {
		if(err) next(err);

		res.render('users/list', {
			title: 'Список пользователей',
			user: req.user,
			users: users
		});

	});

};

exports.getProfile = function(req, res, next) {

	return Users.findByUsername(req.params.username, function(err, user) {
		if(err) next(err);

		if(user) {
			res.render('users/profile', {
				title: 'Профиль пользователя',
				user: user,
				updatedAt: moment(user.updatedAt)
			});
		} else {
			res
        .status(404)
				.render('pages/error', {
					title: 404,
					message: 'Пользователь не найден',
          user: ''
				});
		}

	});

};

exports.settings = {

	getForm: function(req, res, next) {
		return res.render('users/settings', {
			title: 'Настройки профиля',
			csrfToken: req.csrfToken(),
			user: req.user
		});
	},

	save: function(req, res, next) {
		var post = req.body;
		return Users.updateInfo(req.user.email, {
			email: post.email,
			firstName: post.firstName,
			lastName: post.lastName,
			username: post.username,
			gender: post.gender,
			profession: post.profession
		}, function(err, user) {
			if(err) next(err);

			req.logIn(user, function(err) {
				if(err) next(err);

				res.json({status: 'success'});
			});
		});

	}

};

exports.test = function(req, res, next) {

	Users.updateInfo('non', {test: 'test'}, function(err, user, info) {
		res.json([{status: info}]);
	});

};

exports.logout = function(req, res, next) {

	if(req.isAuthenticated()) {
		req.logout();
	}

	return res.redirect('/');

};
