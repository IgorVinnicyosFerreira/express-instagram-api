const PostModel = require('../models/Post');
const error = require('../util/Error');

module.exports = {
  async index(request, response) {
    const { postId } = request.params;
    const { page } = request.query;
    const pageSize = 15;

    try {
      const post = await PostModel.findById(postId).populate({
        path: 'likes',
        select: {
          name: 1,
          username: 1,
          avatar: 1
        },
        options: {
          sort: { username: 1 },
          skip: pageSize * page - pageSize,
          limit: pageSize
        },
        populate: {
          path: 'avatar',
          select: {
            url: 1,
            path: 1
          }
        }
      });

      response.json(post.likes);
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  },

  async create(request, response) {
    const userId = request.user._id;
    const { postId } = request.params;

    try {
      const post = await PostModel.findById(postId);

      if (post.likes.indexOf(userId) === -1) {
        post.likes.push(userId);
        await post.save();
      }

      return response.json({ success: true });
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  },

  async delete(request, response) {
    const userId = request.user._id;
    const { postId } = request.params;

    try {
      const post = await PostModel.findById(postId);

      if (post.likes.indexOf(userId) !== -1) {
        post.likes.pull(userId);
        await post.save();
      }

      return response.json({ success: true });
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  }
};
