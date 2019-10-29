const CommentModel = require('../models/Comment');
const PostModel = require('../models/Post');

module.exports = {

    async create(request, response){
        const userId = request.user._id;
        const { postId } = request.params;
        const { text } = request.body;

        try {
            const post = await PostModel.findById(postId);

            if(!post)
                throw new Error("Post inexistente");

            const comment = await CommentModel.create({
                text,
                author: userId
            });

            if(!post.comments)
                post.comments = [];
            
            post.comments.push(comment);

            await post.save();

            return response.json({ sucess: true });
        } catch (error) {
            return response.status(400).json({ error: error.message });
        }
    }
}