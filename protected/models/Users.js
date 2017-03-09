'use strict';

var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');

var UsersSchema = new mongoose.Schema({
		email: {
			type: String,
			unique: true,
			required: true,
			trim: true
		},
		username: {
			type: String,
			unique: true,
			required: true,
			trim: true
		},
		firstName: {
			type: String
		},
		lastName: {
			type: String
		},
		gender: {
			type: String
		},
		birthday: {
			type: Date
		},
		country: {
			type: String
		},
		city: {
			type: String
		},
		profession: {
			type: String
		},
		specialization: {
			type: String
		},
		typeOfOwnership: [{type: String}],
		priceCat: {
			type: Number,
			require: true,
			default: 1
		},
		phones: [{type: String}],
		sites: [{type: String}],
		regDate: {
			type: Date
		},
		avatar: {
			type: String
		},
		protected: {
			password: {
				type: String,
				required: true
			},
			emailConfirmed: {
				type: Number,
				default: 0
			},
			resetPasswordToken: String,
			resetPasswordExpires: Date
		}
	}, {
		collection: 'users'
	})
	.plugin(timestamps);

/**
 * Действия перед сохранением данных в БД
 */
UsersSchema.pre('save', function(next) {
	var user = this;
	var SALT_FACTOR = 5;

	if(!user.isModified('protected.password')) return next();

	async.waterfall([
		function(cb) {
			bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
				cb(err, salt);
			});
		},
		function(salt, cb) {
			bcrypt.hash(user.protected.password, salt, null, function(err, hash) {
				user.protected.password = hash;
				cb(err);
			});
		}
	],
	function(err) {
		if(err) return next(err);

		next();
	});
});

/**
 * Сравнение пароля и хеша в БД
 * @param  {string}   pwd Пароль для сравнения
 * @param  {Function} cb  Передаваемый callback
 * @return {boolean}      Совпал или нет
 */
UsersSchema.methods.comparePassword = function(pwd, cb) {
	bcrypt.compare(pwd, this.protected.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

/**
 * Поиск пользователя по username
 * @param  {string}   username Юзернейм пользователя, для поиска в БД
 * @param  {Function} cb       Передаваемый callback
 * @return {Object}            Объект с информацией о пользователе. Данные
 * из раздела "protected" не включаются
 */	
UsersSchema.statics.findByUsername = function(username, cb) {
	this.findOne({username: username}, '-protected', function(err, user) {
		if(!user) return cb(null, false);
		cb(err, user);
	});
};

/**
 * Поиск пользователя по E-mail
 * @param  {string}   email E-mail, по которому будет осуществлен поиск в БД
 * @param  {Function} cb    Передаваемый callback
 * @return {Object}         Объект с информацией о пользователе
 */
UsersSchema.statics.findByEmail = function(email, cb) {
	this.findOne({email: email}, function(err, user) {
		if(!user) return cb(null, false);
		cb(err, user);
	});
};

/**
 * Поиск пользователя по Социальной сети
 * @param social
 * @param code
 * @param cb
 */
UsersSchema.statics.findBySocialNetwork = function(social, code, cb) {
	this.findOne({'pretected.code': code}, function(err, user) {
		if(!user) return cb(null, false);
		cb(err, user);
	});
};

/**
 * Фукция обновления данных пользователя
 * @param  {string}   email  E-mail пользователя, для поиска в БД
 * @param  {Object}   params Параметры, которые будут обновлены
 * @param  {Function} cb     Передаваемый callback
 * @return {Object}          Объект с обновленными данными
 */
UsersSchema.statics.updateInfo = function(email, params, cb) {
	this.findOneAndUpdate({email: email}, params, {new: true}, function(err, user) {
		if(!user) return cb(null, false);
		cb(err, user);
	});
};

module.exports = mongoose.model('Users', UsersSchema);
