const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerConfig = require('./config/Multer');

const JwtAuthentication = require('./middlewares/JwtAuthentication');
const UserController = require('./controllers/User');
const AccessController = require('./controllers/Access');
const AvatarController = require('./controllers/Avatar');

router.post('/login', AccessController.login);

router.post('/users', JwtAuthentication, UserController.create, AccessController.create);
router.get('/users/:id', JwtAuthentication, UserController.get);
router.patch('/users', JwtAuthentication, UserController.update);

router.post(
  '/avatars',
  JwtAuthentication,
  multer(multerConfig).single('avatar'),
  AvatarController.save
);
router.get('/avatars', JwtAuthentication, AvatarController.get);

module.exports = router;
