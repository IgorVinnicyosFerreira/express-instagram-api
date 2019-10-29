const UserModel = require('../models/User');

module.exports = {

    async index(request, response){
        const userId = request.user._id;
        const { searchTerm, page } = request.query;

        try {          
            const pageSize = 2;

            const searchQuery = searchTerm
            ? {
                $or: [
                  { name: new RegExp(`^${searchTerm}`, 'i') },
                  { username: new RegExp(`^${searchTerm}`, 'i') }
                ]
              }
            : {};

            const user = await UserModel.findById(userId)
            .populate({
                path: 'followings',
                match: {
                    ...searchQuery,
                },
                options: {
                    skip: (pageSize * page) - pageSize,
                    sort: { username : 1 },
                    limit: pageSize
                }
            });

            return response.json(user.followings);
        } catch (error) {
            return response.status(400).json({ error: error.message });
        }
    },

    async create(request, response){
        const userId = request.user._id;
        const { userIdToFollow } = request.params; 

        try {
            const user = await UserModel.findById(userId);
            const userToFollow = await UserModel.findById(userIdToFollow);

            if(!userToFollow)
                throw new Error("Usuário inexistente");

            user.followings.push(userToFollow);
            await user.save();

            userToFollow.followers.push(user);
            await userToFollow.save();

            return response.json({ success: true });
        } catch (error) {
            response.status(400).json({ error: error.message });
        }
    },

    async delete(request, response){
        const userId = request.user._id;
        const { userIdToUnfollow } = request.params;

        try {
            const user = await UserModel.findById(userId);
            const userToUnfollow = await UserModel.findById(userIdToUnfollow);

            if(!userToUnfollow)
                throw new Error("Usuário inexistente");

            user.followings.pull(userIdToUnfollow);
            await user.save();

            userToUnfollow.followers.pull(userId);
            await userToUnfollow.save();

            return response.json({ success: true });

        } catch (error) {
            return response.status(400).json({ error: error.message });
        }   
    }
}