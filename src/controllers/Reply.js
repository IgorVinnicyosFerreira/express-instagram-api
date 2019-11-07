const CommentModel = require('../models/Comment');
const error = require('../util/Error');

module.exports = {

    async index(request, response) {
        const { commentId } = request.params;
        const { page } = request.query;
        const pageSize = 15;

        try {
            const comment = await CommentModel.findById(commentId).populate({
                path: "replies",
                options: {
                    sort: { createdAt: 1 },
                    skip: (pageSize * page) - pageSize,
                    limit: pageSize
                }
            });

            return response.json(comment.replies);
        } catch (exc) {
            return response.status(500).json({ success: true })
        }
    },

    async create(request, response) {
        const { commentId } = request.params;
        const { text } = request.body;
        const userId = request.user._id;

        try {
            const comment = await CommentModel.findById(commentId);
            const reply = await CommentModel.create({ text, author: userId });

            comment.replies.push(reply);
            await comment.save();

            return response.json({ success: true });
        } catch (exc) {
            return response.status(500).json(error(exc.message));
        }
    },

    async delete(request, response) {
        const { commentId, replyId } = request.params;

        try {
            const comment = await CommentModel.findById(commentId);

            comment.replies.pull(replyId);
            await comment.save();
            await CommentModel.remove({ _id: replyId });

            return response.json({ success: true });
        } catch (exc) {
            return response.status(500).json(error(exc.message));
        }
    }
}