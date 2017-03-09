'use strict';

var express = require('express');
var router = express.Router();
var multer = require('multer');
var async = require('async');
var passport = require('passport');
var join = require('path').join;

var config = require(join(__dirname, '../config'));
var checkAuth = require(join(__dirname, '../utils/checkAuth'));
var controller = require('../controllers/users');

/**
 * Роут регистрации. Доступ запрещен для авторизованных
 */
router
	.route('/user/signup')
	.all(checkAuth)
	.get(controller.signup.getForm)
	.post(controller.signup.do);

/**
 * Роут авторизации. Доступ запрещен для авторизованных
 */
router
	.route('/user/signin')
	.all(restrictIfAuth)
	.get(controller.signin.getForm)
	.post(controller.signin.do);

/**
 * Роут logout. Доступ запрещен для неавторизованных
 */
router
	.route('/user/logout')
	.all(restrictIfNotAuth)
	.get(controller.logout);

/**
 * Роут страницы списка пользователей
 */
router
	.route('/users')
	.get(controller.getAll);

/**
 * Роут страницы редактирования персональной информации и настроек профиля.
 * Доступ запрещен для неавторизованных
 */
router
	.route('/user/settings')
	.all(restrictIfNotAuth)
	.get(controller.settings.getForm)
	.post(controller.settings.save);


router.post('/user/settings/avatar', multer({dest: '../uploads'}).single('files'), function(req, res, next) {
	console.log('done');
	console.log(req.file);
});

/**
 * Роут страницы запроса восстановления пароля. Доступ запрещен для
 * авторизованных
 */
router
	.route('/user/forgot')
	.all(restrictIfAuth)
	.get(controller.forgot.getForm)
	.post(controller.forgot.do);

/**
 * Роут страницы сброса пароля, при переходе по ссылке из E-mail. Доступ
 * запрещен для авторизованных
 */
router
	.route('/user/reset')
	.all(restrictIfAuth)
	.get(function(req, res, next) {
		res.send('token '+ req.query.token +' accepted!');
	});

router.get('/user/test', controller.test);

/**
 * Роут персональной страницы пользователя
 */
router
	.route('/user/:username')
	.get(controller.getProfile);

/**
 * Запрет доступа, если пользователь авторизован
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next callback
 * @return         		   Редирект на главную страницу
 */
function restrictIfAuth(req, res, next) {
	if(req.isAuthenticated()) return res.redirect('/');
	next();
}

/**
 * Запрет доступа, если пользователь не авторизован
 * @param  {Object}   req  request
 * @param  {Object}   res  response
 * @param  {Function} next callback
 * @return         		   Редирект на главную страницу
 */
function restrictIfNotAuth(req, res, next) {
	if(!req.isAuthenticated()) return res.redirect('/user/signin');
	next();
}

module.exports = router;
