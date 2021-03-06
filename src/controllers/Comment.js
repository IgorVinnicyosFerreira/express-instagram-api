const CommentModel = require('../models/Comment');
const PostModel = require('../models/Post');
const error = require('../util/Error');

module.exports = {
  async index(request, response) {
    const { postId } = request.params;
    let { page } = request.query;
    const pageSize = 10;

    try {
      const post = await PostModel.findById(postId)
        .select({ _id: 1 })
        .populate({
          path: 'comments',
          options: {
            skip: pageSize * page - pageSize,
            sort: { createdAt: -1 },
            limit: pageSize
          },
          populate: {
            path: 'author',
            select: { name: 1, username: 1, avatar: 1 },
            populate: {
              path: 'avatar',
              select: { path: 1, url: 1 }
            }
          }
        });

      return response.json(post.comments);
    } catch (exc) {
      return respomse.status(500).json(error(exc.message));
    }
  },

  async create(request, response) {
    const userId = request.user._id;
    const { postId } = request.params;
    const { text } = request.body;

    try {
      const post = await PostModel.findById(postId);

      if (!post) return response.status(400).json(error('Post inexistente'));

      const comment = await CommentModel.create({
        text,
        author: userId
      });

      if (!post.comments) post.comments = [];

      post.comments.push(comment);

      await post.save();

      return response.json({ sucess: true });
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  },

  async delete(request, response) {
    const { commentId, postId } = request.params;

    try {
      const post = await PostModel.findById(postId);
      const comment = await CommentModel.findById(commentId);

      await comment.remove();

      await post.comments.pull(commentId);

      return response.json({ success: true });
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  }
};
