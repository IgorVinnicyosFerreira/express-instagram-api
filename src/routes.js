const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerConfig = require('./config/Multer');

const JwtAuthentication = require('./middlewares/JwtAuthentication');
const UserController = require('./controllers/User');
const AccessController = require('./controllers/Access');
const AvatarController = require('./controllers/Avatar');
const PostController = require('./controllers/Post');

const multerInstance = multer(multerConfig);

router.post('/login', AccessController.login);

router.post('/users', JwtAuthentication, UserController.create, AccessController.create);
router.get('/users/:id', JwtAuthentication, UserController.get);
router.get('/users', JwtAuthentication, UserController.index);
router.patch('/users', JwtAuthentication, UserController.update);

router.post(
  '/avatars',
  JwtAuthentication,
  multerInstance.single('avatar'),
  AvatarController.create
);
router.get('/avatars', JwtAuthentication, AvatarController.get);
router.delete('/avatars', JwtAuthentication, AvatarController.delete);

router.post('/posts', JwtAuthentication, multerInstance.array('media'), PostController.create);
router.get('/posts/:id', JwtAuthentication, PostController.get);
router.get('/posts', JwtAuthentication, PostController.index);
router.delete('/posts/:id', JwtAuthentication, PostController.delete);

module.exports = router;
