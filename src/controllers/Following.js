const UserModel = require('../models/User');
const error = require('../util/Error');

module.exports = {
  async index(request, response) {
    const userId = request.user._id;
    const { searchTerm, page } = request.query;

    try {
      const pageSize = 10;

      const searchQuery = searchTerm
        ? {
            $or: [
              { name: new RegExp(`^${searchTerm}`, 'i') },
              { username: new RegExp(`^${searchTerm}`, 'i') }
            ]
          }
        : {};

      const user = await UserModel.findById(userId).populate({
        path: 'followings',
        match: {
          ...searchQuery
        },
        options: {
          skip: pageSize * page - pageSize,
          sort: { username: 1 },
          limit: pageSize
        }
      });

      return response.json(user.followings);
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  },

  async create(request, response) {
    const userId = request.user._id;
    const { userIdToFollow } = request.params;

    try {
      const user = await UserModel.findById(userId);
      const userToFollow = await UserModel.findById(userIdToFollow);

      if (!userToFollow) return response.status(400).json(error('Usuário inexistente', 'user'));

      user.followings.push(userToFollow);
      await user.save();

      userToFollow.followers.push(user);
      await userToFollow.save();

      return response.json({ success: true });
    } catch (exc) {
      response.status(500).json(error(exc.message));
    }
  },

  async delete(request, response) {
    const userId = request.user._id;
    const { userIdToUnfollow } = request.params;

    try {
      const user = await UserModel.findById(userId);
      const userToUnfollow = await UserModel.findById(userIdToUnfollow);

      if (!userToUnfollow)
        return response.status(400).json(error('Usuário inexistente', 'usuario'));

      user.followings.pull(userIdToUnfollow);
      await user.save();

      userToUnfollow.followers.pull(userId);
      await userToUnfollow.save();

      return response.json({ success: true });
    } catch (exc) {
      return response.status(500).json(error(exc.message));
    }
  }
};
