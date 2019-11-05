const PostModel = require('../models/Post');
const UserModel = require('../models/User');
const error = require('../util/Error');

module.exports = {

    async index(request, response) {
        const userId = request.user._id;
        const { page } = request.query;

        try {
            const user = await UserModel.findById(userId);

            const pageSize = 8;

            const posts = await PostModel.find({
                author: { $in: user.followings },
            })
                .sort({ createdAt: -1 })
                .skip((pageSize * page) - pageSize)
                .limit(pageSize)
                .populate('media');

            return response.json(posts);
        } catch (exc) {
            return response.status(500).json(error(exc.message));
        }
    }
}