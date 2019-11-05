const CommentModel = require('../models/Comment');
const PostModel = require('../models/Post');
const error = require('../util/Error');

module.exports = {

    async create(request, response) {
        const userId = request.user._id;
        const { postId } = request.params;
        const { text } = request.body;

        try {
            const post = await PostModel.findById(postId);

            if (!post)
                return response.status(400).json(error('Post inexistente'))

            const comment = await CommentModel.create({
                text,
                author: userId
            });

            if (!post.comments)
                post.comments = [];

            post.comments.push(comment);

            await post.save();

            return response.json({ sucess: true });
        } catch (exc) {
            return response.status(500).json(error(exc.message));
        }
    }
}