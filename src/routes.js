const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerConfig = require('./config/Multer');

const JwtAuthentication = require('./middlewares/JwtAuthentication');
const UserController = require('./controllers/User');
const AccessController = require('./controllers/Access');
const AvatarController = require('./controllers/Avatar');

router.post('/login', AccessController.login);
router.post('/user/create', UserController.create, AccessController.create);
router.post(
  '/avatar/save',
  JwtAuthentication,
  multer(multerConfig).single('avatar'),
  AvatarController.save
);
router.get('/avatar', JwtAuthentication, AvatarController.get);

module.exports = router;
