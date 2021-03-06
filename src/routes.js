const express = require('express');
const router = express.Router();
const multer = require('multer');
const multerConfig = require('./config/Multer');

const JwtAuthentication = require('./middlewares/JwtAuthentication');
const UserController = require('./controllers/User');
const AccessController = require('./controllers/Access');
const AvatarController = require('./controllers/Avatar');
const PostController = require('./controllers/Post');
const FollowingController = require('./controllers/Following');
const FollowerController = require('./controllers/Follower');
const FeedController = require('./controllers/Feed');
const CommentController = require('./controllers/Comment');
const ReplyController = require('./controllers/Reply');
const StorieController = require('./controllers/Stories');
const LikePostController = require('./controllers/LikePost');
const LikeCommentController = require('./controllers/LikeComment');

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

router.post('/followings/:userIdToFollow', JwtAuthentication, FollowingController.create);
router.delete('/followings/:userIdToUnfollow', JwtAuthentication, FollowingController.delete);
router.get('/followings', JwtAuthentication, FollowingController.index);

router.get('/followers', JwtAuthentication, FollowerController.index);

router.get('/feed', JwtAuthentication, FeedController.index);

router.post('/posts/:postId/comments/', JwtAuthentication, CommentController.create);
router.get('/posts/:postId/comments', JwtAuthentication, CommentController.index);
router.delete('/posts/:postId/comments/:commentId', JwtAuthentication, CommentController.delete);

router.post('/comments/:commentId/replies', JwtAuthentication, ReplyController.create);
router.get('/comments/:commentId/replies', JwtAuthentication, ReplyController.index);
router.delete('/comments/:commentId/replies/:replyId', JwtAuthentication, ReplyController.delete);

router.post('/stories', JwtAuthentication, multerInstance.single('media'), StorieController.create);
router.get('/stories', JwtAuthentication, StorieController.index);
router.delete('/stories/:storiesId', JwtAuthentication, StorieController.delete);

router.post('/posts/:postId/likes', JwtAuthentication, LikePostController.create);
router.delete('/posts/:postId/likes', JwtAuthentication, LikePostController.delete);
router.get('/posts/:postId/likes', JwtAuthentication, LikePostController.index);

router.post('/comments/:commentId/likes', JwtAuthentication, LikeCommentController.create);
router.delete('/comments/:commentId/likes', JwtAuthentication, LikeCommentController.delete);
router.get('/comments/:commentId/likes', JwtAuthentication, LikeCommentController.index);

module.exports = router;
