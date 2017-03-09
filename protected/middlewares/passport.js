'use strict';

var join = require('path').join;
var LocalStrategy = require('passport-local').Strategy;
var RememberMeStrategy = require('passport-remember-me').Strategy;
var VKStrategy = require('passport-vkontakte').Strategy;

var config = require(join(__dirname, '../config'));
var Users = require(join(__dirname, '../models/Users'));

module.exports = function(passport) {

	passport.serializeUser(function(user, done) {
	 	done(null, user);
	});
	 
	passport.deserializeUser(function(user, done) {
	 	done(null, user);
	});

	/**
	 * Passport.js SignUp strategy
	 * TODO: нихрена не работает из-за валидации Mongoose
	 */
	passport.use('signup-strategy',
		new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback : true
		},
		function(req, email, password, done) {
			process.nextTick(function() {

				Users.findByEmail(email, function(err, user) {
					if (err) return done(err);

					if (user) {
						return done(null, false, {
							email: req.__('e-mail is not available')
						});
					} else {
						var User = new Users({
							email: email,
							protected: {
								password: password
							}
						});

						User.save(function(err) {
							if (err) done(err);
							return done(null, User);
						});
					}
				});

			});
		}));

	/**
	 * Passport.js SignIn strategy
	 */
	passport.use('signin-strategy', new LocalStrategy({

		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback : true

	}, function(req, email, password, done) {
		process.nextTick(function() {
			Users.findByEmail(email, function(err, user) {
				if (err) return done(err);
				
				if (!user) return done(null, false, { 
					email: req.__('user with this email address not exist')
				});

				user.comparePassword(password, function(err, isMatch) {
					if (isMatch) {
						return done(null, user);
					} else {
						return done(null, false, { 
							password: req.__('wrong password')
						});
					}
				});
			});
		});
	}));

	/*passport.use(new RememberMeStrategy(

	));*/

	passport.use('vk-strategy', new VKStrategy({
		clientID: config.get('vk:appID'),
		clientSecret: config.get('vk:secureKey'),
		callbackURL: config.get('vk:callbackURL'),
		passReqToCallback: true
	}, function(req, accessToken, refreshToken, account, profile, done) {
		process.nextTick(function() {
			console.log(profile, account);
		});
	}));

};
