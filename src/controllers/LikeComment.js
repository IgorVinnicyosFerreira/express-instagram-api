const CommentModel = require('../models/Comment');
const error = require('../util/Error');

module.exports = {
  async index(request, response) {
    const { commentId } = request.params;
    const { page } = request.query;
    const pageSize = 15;

    try {
      const comment = await CommentModel.findById(commentId).populate({
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

      response.json(comment.likes);
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  },

  async create(request, response) {
    const userId = request.user._id;
    const { commentId } = request.params;

    try {
      const comment = await CommentModel.findById(commentId);

      if (comment.likes.indexOf(userId) === -1) {
        comment.likes.push(userId);
        await comment.save();
      }

      return response.json({ success: true });
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  },

  async delete(request, response) {
    const userId = request.user._id;
    const { commentId } = request.params;

    try {
      const comment = await CommentModel.findById(commentId);

      if (comment.likes.indexOf(userId) !== -1) {
        comment.likes.pull(userId);
        await comment.save();
      }

      return response.json({ success: true });
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  }
};
